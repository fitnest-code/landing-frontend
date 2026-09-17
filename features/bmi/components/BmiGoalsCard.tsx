"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { submitBmiLead } from "../api/bmi-request";
import { addLocaleToPathname } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import type { GoalItem } from "../api/types";
import { useGoals } from "../hooks/use-goals";
import type { Gender } from "../lib/bmi-utils";
import {
  PHONE_PREFIX,
  formatFullPhone,
  isValidPhone,
  normalizePhoneInput,
} from "../lib/bmi-utils";
import { mapApiGoal, goalIconName, type DisplayGoal } from "../lib/goal-display";
import BmiThemeIcon from "./BmiThemeIcon";

interface BmiGoalsCardProps {
  weight: string;
  height: string;
  age: string;
  gender: Gender;
  bmiResult: number | null;
  initialGoals?: GoalItem[];
  initialLocale?: string;
}

const fieldClass =
  "flex items-center gap-3 self-stretch overflow-hidden rounded-xl border border-border-muted bg-surface p-4";

const BmiGoalsCard = ({
  weight,
  height,
  age,
  gender,
  bmiResult: _bmiResult,
  initialGoals,
  initialLocale,
}: BmiGoalsCardProps) => {
  const { t, locale } = useI18n();
  const { data: apiGoals = [], isLoading } = useGoals(locale, {
    initialGoals,
    initialLocale,
  });
  const [goalId, setGoalId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const fallbackGoals = useMemo<DisplayGoal[]>(
    () =>
      t.bmi.goals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        imageSrc: null,
        iconName: goalIconName(goal.id),
        fromApi: false,
      })),
    [t.bmi.goals],
  );

  const goals = useMemo<DisplayGoal[]>(() => {
    if (apiGoals.length > 0) return apiGoals.map(mapApiGoal);
    if (isLoading) return [];
    return fallbackGoals;
  }, [apiGoals, fallbackGoals, isLoading]);

  const heightCm = Number.parseFloat(height.replace(",", "."));
  const weightKg = Number.parseFloat(weight.replace(",", "."));
  const ageValue = Number.parseInt(age, 10);
  const metricsValid =
    Number.isFinite(heightCm) &&
    heightCm >= 80 &&
    heightCm <= 250 &&
    Number.isFinite(weightKg) &&
    weightKg >= 25 &&
    weightKg <= 300;
  const phoneValid = isValidPhone(phone);
  const isFormValid = Boolean(goalId) && phoneValid && consent && metricsValid;

  const handleSubmit = async () => {
    setShowErrors(true);
    if (!isFormValid || submitting || !goalId) return;

    const selectedGoal = goals.find((goal) => goal.id === goalId);
    setSubmitting(true);
    setStatus("idle");
    const ok = await submitBmiLead({
      phone: formatFullPhone(phone),
      goalCode: selectedGoal?.id ?? goalId,
      goalTitle: selectedGoal?.title ?? goalId,
      heightCm,
      weightKg,
      age: Number.isFinite(ageValue) ? ageValue : undefined,
      gender,
      consent: true,
    });
    setSubmitting(false);

    if (ok) {
      setGoalId(null);
      setPhone("");
      setConsent(false);
      setShowErrors(false);
      setStatus("success");
      return;
    }
    setStatus("error");
  };

  return (
    <div className="relative flex w-full flex-col gap-8 rounded-xl border border-border-muted bg-surface p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-[30px] font-medium leading-[46px] text-ink">
          {t.bmi.goalsTitle}
        </h2>
        <p className="text-base leading-6 text-ink">{t.bmi.goalsDescription}</p>
      </div>

      <div className="flex flex-col gap-5">
        {isLoading && goals.length === 0
          ? Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-[88px] w-full animate-pulse rounded-3xl border border-border-muted bg-page/60"
              />
            ))
          : goals.map((goal) => {
              const selected = goalId === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setGoalId(goal.id)}
                  className={`relative flex w-full cursor-pointer flex-col items-start gap-2 rounded-3xl border px-4 py-3 pr-12 text-left transition-colors ${
                    selected
                      ? "border-turquoise bg-cyan/10"
                      : "border-border-muted hover:border-turquoise/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {goal.imageSrc && !brokenImages[goal.id] ? (
                      <img
                        src={goal.imageSrc}
                        alt=""
                        className="size-6 shrink-0 object-contain"
                        onError={() =>
                          setBrokenImages((current) => ({
                            ...current,
                            [goal.id]: true,
                          }))
                        }
                      />
                    ) : goal.fromApi ? (
                      <span className="size-6 shrink-0" aria-hidden />
                    ) : (
                      <BmiThemeIcon
                        name={goal.iconName}
                        className="size-6 shrink-0"
                      />
                    )}
                    <span className="text-lg font-semibold leading-7 text-ink">
                      {goal.title}
                    </span>
                  </span>
                  {goal.description ? (
                    <span className="pl-8 text-base leading-6 text-desc-2">
                      {goal.description}
                    </span>
                  ) : null}
                  {selected ? (
                    <BmiThemeIcon
                      name="tick-circle"
                      className="absolute right-4 top-3 size-6"
                    />
                  ) : null}
                </button>
              );
            })}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium leading-5 text-desc-2">
            {t.bmi.phone}
          </label>
          <div className={fieldClass}>
            <BmiThemeIcon name="phone" className="size-5 shrink-0" />
            <span className="shrink-0 text-base leading-6 text-[#94979C] dark:text-[#A6A6A6]">
              {PHONE_PREFIX}
            </span>
            <input
              value={phone}
              onChange={(event) =>
                setPhone(normalizePhoneInput(event.target.value))
              }
              placeholder={t.bmi.phonePlaceholder}
              inputMode="tel"
              autoComplete="tel"
              className="h-6 w-full bg-transparent text-base leading-6 text-ink outline-none placeholder:text-[#94979C] dark:placeholder:text-[#A6A6A6]"
            />
          </div>
          {showErrors && !phoneValid ? (
            <span className="text-sm text-energy">{t.bmi.phoneError}</span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setConsent((current) => !current)}
          className="flex cursor-pointer items-center gap-1 text-left"
          aria-checked={consent}
          role="checkbox"
        >
          <span
            className={`flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-[3px] ${
              consent ? "bg-cyan/20" : ""
            }`}
          >
            <BmiThemeIcon
              name={consent ? "tick-square" : "square"}
              className="size-4"
            />
          </span>
          <span className="text-xs leading-[18px] text-ink">{t.bmi.consent}</span>
        </button>
      </div>

      {showErrors && !isFormValid ? (
        <p className="text-sm leading-5 text-energy">{t.bmi.formError}</p>
      ) : null}
      {status === "success" ? (
        <p className="text-sm leading-5 text-turquoise">{t.bmi.contactSuccess}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm leading-5 text-energy">{t.bmi.contactError}</p>
      ) : null}

      <div className="flex flex-col gap-3">
        <Link
          href={addLocaleToPathname("/privacy", locale)}
          className="w-fit text-xs font-medium leading-[18px] text-turquoise underline"
        >
          {t.bmi.privacy}
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-button px-4 text-base font-semibold leading-6 text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#FF6A42] hover:text-white hover:shadow-[0_8px_20px_rgba(20,35,75,0.25)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 dark:text-[#011729] dark:hover:text-white dark:hover:shadow-[0_8px_20px_rgba(0,219,219,0.25)]"
        >
          {submitting ? t.bmi.contactSending : t.bmi.contactCta}
        </button>
      </div>
    </div>
  );
};

export default BmiGoalsCard;
