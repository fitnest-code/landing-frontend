"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { addLocaleToPathname } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import {
  LANDING_GYMS_PAGE_SIZE,
  getLandingGymsPage,
  type LandingGym,
  type LandingListFilters,
} from "@/lib/api/landing";
import type { MembershipTier } from "@/features/home/components/MembershipBadge";
import { BAKI_RAYONS, isBakiCity } from "@/lib/constants/az-cities";
import FitnessCenterCard from "../components/FitnessCenterCard";
import FiltersSection, { type GymsFiltersValue } from "./FiltersSection";
import { Stagger } from "@/components/animation";

const MEMBERSHIP_VALUES = new Set(["bronze", "silver", "gold", "platinum"]);

const emptyFilters: GymsFiltersValue = {
  query: "",
  city: "",
  rayon: "",
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

const formatLocation = (gym: LandingGym) =>
  [gym.location, gym.rayon, gym.city].filter(Boolean).join(", ") || "—";

const toApiFilters = (filters: GymsFiltersValue): LandingListFilters => ({
  q: filters.query.trim() || undefined,
  city: filters.city || undefined,
  rayon: filters.rayon || undefined,
  category: filters.category || undefined,
  membership: filters.membership || undefined,
});

const mergeById = (current: LandingGym[], incoming: LandingGym[]) => {
  const seen = new Set(current.map((gym) => gym.gymId));
  const next = [...current];
  for (const gym of incoming) {
    if (seen.has(gym.gymId)) continue;
    seen.add(gym.gymId);
    next.push(gym);
  }
  return next;
};

type FitnessCentersListSectionProps = {
  gyms: LandingGym[];
  total: number;
  page: number;
  pageSize?: number;
  cities?: string[];
  rayonsByCity?: Record<string, string[]>;
  categories?: string[];
};

const FitnessCentersListSection = ({
  gyms: initialGyms,
  total: initialTotal,
  page: initialPage,
  pageSize = LANDING_GYMS_PAGE_SIZE,
  cities: citiesFromApi,
  rayonsByCity: rayonsByCityFromApi,
  categories: categoriesFromApi,
}: FitnessCentersListSectionProps) => {
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
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);
  const [items, setItems] = useState(initialGyms);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const skipFirstFetch = useRef(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(filters.query), 350);
    return () => window.clearTimeout(timer);
  }, [filters.query]);

  useEffect(() => {
    setFilters((current) => {
      if (current.membership === initialMembership) return current;
      return { ...current, membership: initialMembership };
    });
  }, [initialMembership]);

  useEffect(() => {
    const apiFilters = toApiFilters({ ...filters, query: debouncedQuery });
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      if (!apiFilters.q && !apiFilters.city && !apiFilters.rayon && !apiFilters.category && !apiFilters.membership) {
        return;
      }
    }

    let cancelled = false;
    setLoading(true);
    getLandingGymsPage(locale, 1, pageSize, apiFilters)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setPage(data.page);
        setTotal(data.total);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, filters.city, filters.rayon, filters.category, filters.membership, locale, pageSize]);

  const cities = useMemo(
    () =>
      citiesFromApi && citiesFromApi.length > 0
        ? citiesFromApi
        : uniqueSorted(items.map((gym) => gym.city)),
    [citiesFromApi, items],
  );
  const rayons = useMemo(() => {
    if (!isBakiCity(filters.city)) return [];
    const fromApi = rayonsByCityFromApi?.["Bakı"] || rayonsByCityFromApi?.[filters.city];
    if (fromApi && fromApi.length > 0) return fromApi;
    return [...BAKI_RAYONS];
  }, [filters.city, rayonsByCityFromApi]);
  const categories = useMemo(
    () =>
      categoriesFromApi && categoriesFromApi.length > 0
        ? categoriesFromApi
        : uniqueSorted(items.flatMap((gym) => gym.categories)),
    [categoriesFromApi, items],
  );

  const hasMore = page * pageSize < total;

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await getLandingGymsPage(
        locale,
        page + 1,
        pageSize,
        toApiFilters({ ...filters, query: debouncedQuery }),
      );
      setItems((current) => mergeById(current, data.items));
      setPage(data.page);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <FiltersSection
        value={filters}
        cities={cities}
        rayons={rayons}
        categories={categories}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      <Stagger
        key={`${filters.city}-${filters.rayon}-${filters.category}-${filters.membership}-${debouncedQuery}`}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variant="rise"
        delay={0.06}
        whenInView={false}
      >
        {items.map((gym) => (
          <FitnessCenterCard
            key={gym.gymId}
            name={gym.name}
            location={formatLocation(gym)}
            image={gym.coverImageUrl || ""}
            category={gym.category || ""}
            categoryItems={gym.categoryItems}
            membership={toTier(gym.membership)}
            href={addLocaleToPathname(`/fitness-centers/${gym.gymId}`, locale)}
          />
        ))}
      </Stagger>

      {hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={loading}
            onClick={loadMore}
            className="inline-flex h-12 min-w-[194px] cursor-pointer items-center justify-center rounded-[32px] border border-border-muted bg-surface px-4 text-base font-semibold leading-6 text-ink transition-colors hover:border-cyan hover:text-turquoise disabled:cursor-wait disabled:opacity-70"
          >
            {t.centers.loadMore}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FitnessCentersListSection;
