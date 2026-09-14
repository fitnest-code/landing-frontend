"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { addLocaleToPathname } from "@/lib/i18n/config";
import MembershipBadge, {
  type MembershipTier,
} from "@/features/home/components/MembershipBadge";
import type { SubscriptionPackage } from "@/features/offers/api/types";
import { formatManat, monthlyPrice } from "@/features/offers/lib/price";
import { cn } from "@/lib/utils";
import { Stagger } from "@/features/home/components/Reveal";
import TiltCard from "@/features/home/components/TiltCard";

export const PLAN_DURATIONS = [1, 3, 6, 12] as const;
export type PlanDuration = (typeof PLAN_DURATIONS)[number];

const TIER_ORDER: MembershipTier[] = ["bronze", "silver", "gold", "platinum"];

const fallbackPlans: Record<
  MembershipTier,
  { price: number; original: number }
> = {
  bronze: { price: 47, original: 55 },
  silver: { price: 72, original: 85 },
  gold: { price: 132, original: 155 },
  platinum: { price: 205, original: 255 },
};

const normalizeTier = (name: string): MembershipTier | null => {
  const lower = name.toLowerCase();
  if (lower.includes("bronze")) return "bronze";
  if (lower.includes("silver")) return "silver";
  if (lower.includes("gold")) return "gold";
  if (lower.includes("platinum")) return "platinum";
  return null;
};

const featuresFromOption = (
  option: SubscriptionPackage["options"][number] | undefined,
  fallback: string[],
): string[] => {
  const fromServices = (option?.services ?? [])
    .map((service) => service.service_name?.trim())
    .filter((name): name is string => Boolean(name));
  const fromBenefits = (option?.benefits ?? [])
    .map((benefit) => benefit.description?.trim())
    .filter((description): description is string => Boolean(description));
  const unique = [...new Set([...fromServices, ...fromBenefits])];
  return unique.length > 0 ? unique.slice(0, 4) : fallback;
};

type PlanPickerProps = {
  packages: SubscriptionPackage[];
  initialDuration?: PlanDuration;
  selectTarget?: "offers" | "activate";
};

const PlanPicker = ({
  packages,
  initialDuration = 1,
  selectTarget = "offers",
}: PlanPickerProps) => {
  const { t, locale } = useI18n();
  const [duration, setDuration] = useState<PlanDuration>(initialDuration);

  const plans = useMemo(() => {
    return TIER_ORDER.map((tier) => {
      const match = packages.find((pkg) => normalizeTier(pkg.name) === tier);
      const option = match?.options.find(
        (item) => item.duration_months === duration,
      );
      const defaultFeatures =
        t.home.planFeatures[tier] ?? t.home.planFeatures.bronze;
      const months = option?.duration_months ?? duration;
      const effectiveTotal = option?.price.effective;
      const baseTotal = option?.price.base;
      const pricePerMonth =
        effectiveTotal != null
          ? monthlyPrice(effectiveTotal, months)
          : fallbackPlans[tier].price;
      const originalPerMonth =
        baseTotal != null
          ? monthlyPrice(baseTotal, months)
          : fallbackPlans[tier].original;
      const savings = Math.max(0, originalPerMonth - pricePerMonth);

      return {
        tier,
        price: pricePerMonth,
        original: originalPerMonth,
        savings,
        features: featuresFromOption(option, defaultFeatures),
        mostPopular: tier === "platinum",
      };
    });
  }, [packages, duration, t.home.planFeatures]);

  const hrefFor = (tier: MembershipTier) => {
    if (selectTarget === "activate") return "#activate";
    return addLocaleToPathname(`/offers?type=${tier}&month=${duration}`, locale);
  };

  const gymsHref = addLocaleToPathname("/fitness-centers", locale);

  return (
    <div className="flex flex-col items-center">
      <Stagger
        className="grid w-full max-w-[640px] grid-cols-4 gap-1 pt-8 sm:gap-4"
        variant="scale"
        delay={0.06}
      >
        {PLAN_DURATIONS.map((month) => {
          const active = duration === month;
          const isYear = month === 12;
          return (
            <div key={month} className="relative min-w-0 cursor-pointer">
              {isYear ? (
                <span className="absolute top-0 right-0 z-10 translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-energy px-2.5 py-[3px] text-[10px] font-semibold leading-[14px] text-white">
                  {t.home.bestValue}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => setDuration(month)}
                className={cn(
                  "h-11 w-full cursor-pointer rounded-t-[14px] border-x-[1.5px] border-t-[1.5px] px-1 text-[11px] font-bold leading-6 transition-colors sm:px-4 sm:text-base",
                  active
                    ? "border-brand-navy bg-brand-navy-800 text-white"
                    : "border-border-muted bg-surface text-ink hover:border-cyan hover:text-turquoise",
                )}
              >
                {month} {t.home.monthShort}
              </button>
            </div>
          );
        })}
      </Stagger>

      <Stagger
        className="relative grid w-full grid-cols-1 gap-4 rounded-2xl border border-border-muted p-3 pt-10 sm:grid-cols-2 xl:grid-cols-4"
        variant="rise"
        delay={0.1}
      >
        {plans.map((plan) => (
          <TiltCard key={plan.tier} intensity={8} className="h-full">
            <article className="group relative flex h-full min-w-0 flex-col items-start gap-7 rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-transparent transition-all hover:outline-[#00DBDB] sm:p-7 dark:bg-page dark:outline-border-muted dark:hover:outline-cyan">
              {plan.mostPopular ? (
                <span className="absolute -top-3 right-4 whitespace-nowrap rounded-full bg-turquoise px-[18px] py-[5px] text-xs font-semibold leading-[18px] text-white">
                  {t.home.mostPopular}
                </span>
              ) : null}

              <div className="flex w-full flex-col gap-3">
                <MembershipBadge tier={plan.tier} showDiscount={false} />
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col">
                    {plan.original > plan.price ? (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-bold leading-7 text-[#214A6E] line-through">
                            {formatManat(plan.original)}
                          </span>
                          <img
                            src="/icons/subscription/manat.svg"
                            alt=""
                            width={12}
                            height={14}
                            className="h-3.5 w-3 opacity-90"
                          />
                        </div>
                        {plan.savings > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold leading-5 text-[#0FAD17]">
                              {formatManat(plan.savings)}
                            </span>
                            <img
                              src="/icons/subscription/manat-green.svg"
                              alt=""
                              width={8}
                              height={9}
                              className="h-2.5 w-2"
                            />
                            <span className="text-sm font-semibold leading-5 text-[#0FAD17]">
                              {t.home.savingsLabel}
                            </span>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-sm font-medium leading-5 text-title">
                        &nbsp;
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[36px] font-bold leading-[52px] text-heading">
                      {formatManat(plan.price)}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold leading-5 text-title">
                      <span>₼</span>
                      <span>/ {t.home.monthShort}</span>
                    </span>
                  </div>
                </div>
              </div>

              <ul className="flex w-full flex-1 flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex min-w-0 items-center gap-2.5 text-sm font-medium leading-5 text-title"
                  >
                    <img
                      src="/icons/subscription/check.svg"
                      alt=""
                      width={14}
                      height={14}
                      className="size-3.5 shrink-0"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex w-full flex-col gap-3">
                <Link
                  href={gymsHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-base font-semibold text-[#00A4A4] transition-colors hover:bg-[#E6FBFB]"
                >
                  {t.offers.includedGyms}
                  <img
                    src="/icons/subscription/arrow-right.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </Link>
                <Link
                  href={hrefFor(plan.tier)}
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-button px-4 text-base font-semibold text-white transition-colors hover:bg-[#1c3168] group-hover:bg-button"
                >
                  {t.home.selectPackage}
                </Link>
              </div>
            </article>
          </TiltCard>
        ))}
      </Stagger>
    </div>
  );
};

export default PlanPicker;
