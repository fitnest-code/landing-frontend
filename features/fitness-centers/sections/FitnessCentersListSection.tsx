"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { addLocaleToPathname } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import type { LandingGym } from "@/lib/api/landing";
import type { MembershipTier } from "@/features/home/components/MembershipBadge";
import FitnessCenterCard from "../components/FitnessCenterCard";
import FiltersSection, { type GymsFiltersValue } from "./FiltersSection";
import { Stagger } from "@/components/animation";

const PAGE_SIZE = 12;

const MEMBERSHIP_VALUES = new Set(["bronze", "silver", "gold", "platinum"]);

const emptyFilters: GymsFiltersValue = {
  query: "",
  city: "",
  category: "",
  membership: "",
};

const toTier = (membership: LandingGym["membership"]): MembershipTier => {
  if (
    membership === "silver" ||
    membership === "gold" ||
    membership === "platinum"
  ) {
    return membership;
  }
  return "bronze";
};

const uniqueSorted = (values: Array<string | null | undefined>) =>
  [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])].sort(
    (a, b) => a.localeCompare(b, "az"),
  );

type FitnessCentersListSectionProps = {
  gyms: LandingGym[];
};

const FitnessCentersListSection = ({ gyms }: FitnessCentersListSectionProps) => {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const membershipParam = searchParams.get("membership")?.toLowerCase() ?? "";
  const initialMembership = MEMBERSHIP_VALUES.has(membershipParam)
    ? membershipParam
    : "";

  const [filters, setFilters] = useState<GymsFiltersValue>(() => ({
    ...emptyFilters,
    membership: initialMembership,
  }));
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setFilters((current) => {
      if (current.membership === initialMembership) return current;
      return { ...current, membership: initialMembership };
    });
    setVisibleCount(PAGE_SIZE);
  }, [initialMembership]);

  const cities = useMemo(() => uniqueSorted(gyms.map((gym) => gym.city)), [gyms]);
  const categories = useMemo(
    () => uniqueSorted(gyms.map((gym) => gym.category)),
    [gyms],
  );
  const filtered = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase("az");
    return gyms.filter((gym) => {
      if (filters.city && gym.city !== filters.city) return false;
      if (filters.category && gym.category !== filters.category) return false;
      if (filters.membership && gym.membership !== filters.membership) return false;
      if (!query) return true;
      const haystack = [gym.name, gym.location, gym.city, gym.category]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("az");
      return haystack.includes(query);
    });
  }, [filters, gyms]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-10">
      <FiltersSection
        value={filters}
        cities={cities}
        categories={categories}
        onChange={(next) => {
          setFilters(next);
          setVisibleCount(PAGE_SIZE);
        }}
        onReset={() => {
          setFilters(emptyFilters);
          setVisibleCount(PAGE_SIZE);
        }}
      />

      <Stagger
        key={`${filters.city}-${filters.category}-${filters.membership}-${filters.query}`}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variant="rise"
        delay={0.06}
      >
        {visible.map((gym) => (
          <FitnessCenterCard
            key={gym.gymId}
            name={gym.name}
            location={gym.location || gym.city || "—"}
            phone={gym.phone || ""}
            image={gym.coverImageUrl || ""}
            category={gym.category || ""}
            membership={toTier(gym.membership)}
            href={addLocaleToPathname(`/fitness-centers/${gym.gymId}`, locale)}
          />
        ))}
      </Stagger>

      {visibleCount < filtered.length ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="inline-flex h-12 min-w-[194px] items-center justify-center rounded-[32px] border border-border-muted bg-surface px-4 text-base font-semibold leading-6 text-ink"
          >
            {t.centers.loadMore}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FitnessCentersListSection;
