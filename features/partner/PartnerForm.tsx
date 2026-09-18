"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { partnerFormSchema } from "@/schemas/schemas";
import { submitLandingPartnerApplication } from "@/lib/api/landing";
import { apiClient } from "@/lib/api";
import { FormError, FormSuccess, withPhone } from "@/components/common/FormFeedback";
import { useI18n } from "@/lib/i18n/provider";
import {
  PHONE_PREFIX,
  formatFullPhone,
  isValidPhone,
  normalizePhoneInput,
} from "@/features/bmi/lib/bmi-utils";
import PartnerThemeIcon from "./PartnerThemeIcon";

type PartnerFormValues = z.infer<typeof partnerFormSchema>;

const fieldClass =
  "w-full rounded-xl border border-border-muted bg-surface px-4 py-4 text-base leading-6 text-ink outline-none placeholder:text-[#94979C] dark:placeholder:text-[#A6A6A6]";

const PartnerForm = () => {
  const { t } = useI18n();
  const copy = t.partner;
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [activityOpen, setActivityOpen] = useState(false);
  const [customActivity, setCustomActivity] = useState("");
  const [extraActivities, setExtraActivities] = useState<string[]>([]);
  const [apiCategories, setApiCategories] = useState<string[]>([]);
  const activityRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      gymName: "",
      contactName: "",
      phone: "",
      email: "",
      activity: "",
    },
  });

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<{ categories?: string[] }>("/public/landing/gyms/filters")
      .then(({ data }) => {
        if (!cancelled) setApiCategories(data.categories ?? []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activityOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!activityRef.current?.contains(event.target as Node)) {
        setActivityOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [activityOpen]);

  const activityOptions = useMemo(() => {
    const fromCopy = copy.activityOptions;
    const seen = new Set(fromCopy.map((option) => option.label.toLocaleLowerCase("az")));
    const extras = [
      ...apiCategories,
      ...extraActivities,
    ]
      .map((label) => label.trim())
      .filter(Boolean)
      .filter((label) => {
        const key = label.toLocaleLowerCase("az");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((label) => ({ value: label, label }));
    return [...fromCopy, ...extras];
  }, [apiCategories, copy.activityOptions, extraActivities]);

  const selectedActivity = activityOptions.find(
    (option) => option.value === form.watch("activity"),
  );

  async function onSubmit(values: PartnerFormValues) {
    setStatus("idle");
    const localPhone = normalizePhoneInput(values.phone);
    if (!isValidPhone(localPhone)) {
      form.setError("phone", { message: t.bmi.phoneError });
      return;
    }
    const activityLabel =
      activityOptions.find((option) => option.value === values.activity)?.label ??
      values.activity;
    const ok = await submitLandingPartnerApplication({
      gymName: values.gymName,
      contactName: values.contactName,
      phone: formatFullPhone(localPhone),
      email: values.email,
      activity: activityLabel,
    });
    if (ok) {
      form.reset();
      setCustomActivity("");
      setStatus("success");
      return;
    }
    setStatus("error");
  }

  function addCustomActivity() {
    const label = customActivity.trim();
    if (label.length < 2) return;
    setExtraActivities((current) =>
      current.includes(label) ? current : [...current, label],
    );
    form.setValue("activity", label, { shouldValidate: true });
    setCustomActivity("");
    setActivityOpen(false);
  }

  if (status === "success") {
    return (
      <div
        id="partner-apply"
        className="w-full max-w-[684px] overflow-visible rounded-2xl border border-border-muted bg-page"
      >
        <FormSuccess title={copy.successTitle} body={withPhone(copy.success)} />
      </div>
    );
  }

  return (
    <form
      id="partner-apply"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full max-w-[684px] flex-col gap-7 overflow-visible rounded-2xl border border-border-muted bg-page p-7"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="font-manrope text-xl font-extrabold leading-[30px] text-ink">
          {copy.formTitle}
        </h2>
        <p className="text-sm leading-5 text-title">{copy.formSubtitle}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <input
              {...form.register("gymName")}
              autoComplete="organization"
              placeholder={copy.gymName}
              className={fieldClass}
            />
            {form.formState.errors.gymName ? (
              <span className="text-sm text-energy">{form.formState.errors.gymName.message}</span>
            ) : null}
          </label>
          <label className="flex flex-col gap-1">
            <input
              {...form.register("contactName")}
              autoComplete="name"
              placeholder={copy.contactName}
              className={fieldClass}
            />
            {form.formState.errors.contactName ? (
              <span className="text-sm text-energy">
                {form.formState.errors.contactName.message}
              </span>
            ) : null}
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <div className={`${fieldClass} flex items-center gap-2`}>
              <span className="shrink-0 text-[#94979C] dark:text-[#A6A6A6]">{PHONE_PREFIX}</span>
              <input
                value={form.watch("phone")}
                onChange={(event) =>
                  form.setValue("phone", normalizePhoneInput(event.target.value), {
                    shouldValidate: true,
                  })
                }
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={t.bmi.phonePlaceholder}
                className="w-full bg-transparent outline-none"
              />
            </div>
            {form.formState.errors.phone ? (
              <span className="text-sm text-energy">{form.formState.errors.phone.message}</span>
            ) : null}
          </label>
          <label className="flex flex-col gap-1">
            <input
              {...form.register("email")}
              type="email"
              autoComplete="email"
              placeholder={copy.email}
              className={fieldClass}
            />
            {form.formState.errors.email ? (
              <span className="text-sm text-energy">{form.formState.errors.email.message}</span>
            ) : null}
          </label>
        </div>

        <div ref={activityRef} className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={activityOpen}
            aria-controls={menuId}
            onClick={() => setActivityOpen((open) => !open)}
            className={`${fieldClass} flex items-center justify-between gap-3 text-left`}
          >
            <span className={selectedActivity ? "text-ink" : "text-[#94979C] dark:text-[#A6A6A6]"}>
              {selectedActivity?.label ?? copy.activity}
            </span>
            <PartnerThemeIcon
              name="arrow-down"
              width={20}
              height={20}
              className={`size-5 shrink-0 transition-transform ${activityOpen ? "rotate-180" : ""}`}
            />
          </button>
          {activityOpen ? (
            <div
              id={menuId}
              role="listbox"
              className="absolute z-[80] mt-2 w-full overflow-hidden rounded-xl border border-border-muted bg-surface py-1 shadow-[0px_8px_24px_rgba(1,23,41,0.12)]"
            >
              <ul className="max-h-56 overflow-y-auto py-1">
                {activityOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={form.watch("activity") === option.value}
                      className="flex w-full px-4 py-2.5 text-left text-base text-ink hover:bg-page"
                      onClick={() => {
                        form.setValue("activity", option.value, { shouldValidate: true });
                        setActivityOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 border-t border-border-muted p-2">
                <input
                  value={customActivity}
                  onChange={(event) => setCustomActivity(event.target.value)}
                  placeholder={copy.customActivity}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-border-muted bg-page px-3 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomActivity}
                  className="h-10 shrink-0 rounded-lg bg-button px-3 text-sm font-semibold text-white"
                >
                  {copy.addActivity}
                </button>
              </div>
            </div>
          ) : null}
          {form.formState.errors.activity ? (
            <span className="mt-1 block text-sm text-energy">
              {form.formState.errors.activity.message}
            </span>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-button px-4 text-base font-semibold leading-6 text-white transition-colors hover:bg-[#FF6A42] disabled:opacity-60"
      >
        {form.formState.isSubmitting ? copy.sending : copy.submit}
      </button>
      {status === "error" ? (
        <FormError title={copy.errorTitle} body={copy.error} />
      ) : null}
    </form>
  );
};

export default PartnerForm;
