"use client";

import { useEffect, useState } from "react";
import { getLandingGymsV2Page } from "@/lib/api/landing-v2";
import type { LandingListFilters } from "@/lib/api/landing";
import { useI18n } from "@/lib/i18n/provider";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/lock-body-scroll";
import { cn } from "@/lib/utils";
import type { GymsFiltersValue } from "../sections/FiltersSection";

const CHIPS_COLLAPSED = 4;

const MEMBERSHIP_OPTIONS = [
  { value: "", label: null },
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "platinum", label: "Platinum" },
] as const;

type Draft = Pick<GymsFiltersValue, "city" | "category" | "membership"> & {
  audience: string;
};

// `audience` is intentionally absent: landing v2 has no gender filter, so the
// control exists for design parity only and must never reach the API.
const toApiFilters = (query: string, draft: Draft): LandingListFilters => ({
  q: query.trim() || undefined,
  city: draft.city || undefined,
  category: draft.category || undefined,
  membership: draft.membership || undefined,
});

type SegmentedProps = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
};

const Segmented = ({ options, value, onChange, label }: SegmentedProps) => (
  <div
    role="radiogroup"
    aria-label={label}
    className="flex gap-1 rounded-xl bg-[#F4F8FA] p-1"
  >
    {options.map((option) => {
      const selected = option.value === value;
      return (
        <button
          key={option.value || "all"}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-9 min-w-0 flex-1 rounded-lg px-1 text-sm font-medium transition-colors",
            selected
              ? "bg-white text-[#011729] outline outline-1 outline-[#00DBDB]"
              : "text-[#90A1B9]",
          )}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

type ChipGroupProps = {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  showAllLabel: string;
};

const ChipGroup = ({
  items,
  value,
  onChange,
  label,
  showAllLabel,
}: ChipGroupProps) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, CHIPS_COLLAPSED);

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {visible.map((item) => {
        const selected = item === value;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={selected}
            // Single-select: tapping the active chip clears it.
            onClick={() => onChange(selected ? "" : item)}
            className={cn(
              "h-9 rounded-[32px] px-4 text-sm font-medium transition-colors",
              selected
                ? "bg-[#00DBDB] text-white"
                : "bg-white text-[#011729] outline outline-1 outline-[#90A1B9]",
            )}
          >
            {item}
          </button>
        );
      })}
      {!expanded && items.length > CHIPS_COLLAPSED ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="h-9 px-1 text-sm font-medium text-[#00DBDB]"
        >
          {showAllLabel} ({items.length})
        </button>
      ) : null}
    </div>
  );
};

type SectionHeaderProps = {
  title: string;
  status: string;
  titleClassName?: string;
};

const SectionHeader = ({ title, status, titleClassName }: SectionHeaderProps) => (
  <div className="flex items-center justify-between gap-3">
    <span
      className={cn(
        "text-base font-medium leading-6 text-[#0B2340]",
        titleClassName,
      )}
    >
      {title}
    </span>
    <span className="truncate text-sm font-light leading-5 text-[#8D9AA5]">
      {status}
    </span>
  </div>
);

type GymsFilterModalProps = {
  /** Applied filters; the draft is seeded from these each time the modal mounts. */
  value: GymsFiltersValue;
  cities: string[];
  categories: string[];
  /** Initial count shown on the apply button before the first prefetch lands. */
  resultTotal?: number;
  onClose: () => void;
  onApply: (value: GymsFiltersValue) => void;
};

// Parent mounts this only while open, so the draft naturally resets on every
// open and Escape/backdrop close discards it without extra bookkeeping.
const GymsFilterModal = ({
  value,
  cities,
  categories,
  resultTotal,
  onClose,
  onApply,
}: GymsFilterModalProps) => {
  const { t, locale } = useI18n();
  const [draft, setDraft] = useState<Draft>({
    city: value.city,
    category: value.category,
    membership: value.membership,
    audience: value.audience ?? "",
  });
  const [count, setCount] = useState<number | null>(resultTotal ?? null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    lockBodyScroll();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      unlockBodyScroll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  // Debounced count prefetch (page_size 1 -> only `total` matters). Keeps the
  // last known count while loading so the button doesn't flicker.
  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      getLandingGymsV2Page(
        locale,
        1,
        1,
        toApiFilters(value.query, draft),
      ).then((data) => {
        if (!cancelled) setCount(data.total);
      });
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [draft.city, draft.category, draft.membership, locale, value.query]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (patch: Partial<Draft>) =>
    setDraft((current) => ({ ...current, ...patch }));

  const apply = () => {
    onApply({
      ...value,
      city: draft.city,
      // Rayon belongs to a city; drop it whenever the city changes.
      rayon: draft.city === value.city ? value.rayon : "",
      category: draft.category,
      membership: draft.membership,
      audience: draft.audience,
    });
    onClose();
  };

  const c = t.centers;
  const membershipOptions = MEMBERSHIP_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label ?? c.allOption,
  }));
  const membershipHint = draft.membership
    ? `${membershipOptions.find((o) => o.value === draft.membership)?.label} — ${c.membershipPackageHint}`
    : c.membershipAllHint;
  const audienceOptions = [
    { value: "", label: c.allOption },
    { value: "male", label: c.forMale },
    { value: "female", label: c.forFemale },
    { value: "mixed", label: c.forMixed },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gyms-filter-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40"
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[428px] flex-col overflow-hidden rounded-[18px] bg-surface outline outline-1 outline-[#DCE6EB]">
        <div className="flex items-start justify-between gap-3 border-b border-[#DCE6EB] px-[18px] py-4">
          <div className="flex flex-col">
            <h2
              id="gyms-filter-title"
              className="text-xl font-medium leading-[30px] text-[#0B2340]"
            >
              {c.filtersTitle}
            </h2>
            <p className="text-base text-[#6F7F8F]">{c.filtersSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.closeFilters}
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
          >
            <img
              src="/icons/gyms/close.svg"
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <section className="flex flex-col gap-3 border-b border-[#E8EEF1] px-[18px] py-4">
            <SectionHeader
              title={c.cityDistrict}
              status={draft.city || c.notSelected}
            />
            <ChipGroup
              items={cities}
              value={draft.city}
              onChange={(city) => update({ city })}
              label={c.cityDistrict}
              showAllLabel={c.showAll}
            />
          </section>

          <section className="flex flex-col gap-3 border-b border-[#E8EEF1] px-[18px] py-4">
            <SectionHeader
              title={c.membershipPackage}
              status={c.membershipPackageHint}
            />
            <Segmented
              options={membershipOptions}
              value={draft.membership}
              onChange={(membership) => update({ membership })}
              label={c.membershipPackage}
            />
            <p className="text-xs font-light leading-[18px] text-[#82909C]">
              {membershipHint}
            </p>
          </section>

          <section className="flex flex-col gap-3 border-b border-[#E8EEF1] px-[18px] py-4">
            <SectionHeader
              title={c.workoutTypes}
              status={draft.category || c.notSelected}
            />
            <ChipGroup
              items={categories}
              value={draft.category}
              onChange={(category) => update({ category })}
              label={c.workoutTypes}
              showAllLabel={c.showAll}
            />
          </section>

          <section className="flex flex-col gap-3 px-[18px] py-4">
            <span className="text-xs font-bold leading-[18px] text-[#0B2340]">
              {c.forWhom}
            </span>
            <Segmented
              options={audienceOptions}
              value={draft.audience}
              onChange={(audience) => update({ audience })}
              label={c.forWhom}
            />
          </section>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#E8EEF1] px-[18px] py-4">
          <button
            type="button"
            onClick={() =>
              setDraft({ city: "", category: "", membership: "", audience: "" })
            }
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white text-base font-semibold text-[#011729] outline outline-1 outline-[#EAEAEA]"
          >
            <img
              src="/icons/gyms/clear.svg"
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
            {c.clearFilters}
          </button>
          <button
            type="button"
            onClick={apply}
            className="h-12 w-full rounded-lg bg-[#14234B] text-base font-semibold text-white"
          >
            {c.showResults.replace("{n}", count === null ? "…" : String(count))}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymsFilterModal;
