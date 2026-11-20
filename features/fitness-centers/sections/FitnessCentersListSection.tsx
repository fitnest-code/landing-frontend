"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addLocaleToPathname } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import type { LandingListFilters } from "@/lib/api/landing";
import {
  LANDING_GYMS_V2_PAGE_SIZE,
  getLandingGymsV2Page,
  type LandingGymV2,
} from "@/lib/api/landing-v2";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import type { MembershipTier } from "@/features/home/components/MembershipBadge";
import { BAKI_RAYONS, isBakiCity } from "@/lib/constants/az-cities";
import FitnessCenterCard from "../components/FitnessCenterCard";
import FitnessCenterPreview from "../components/FitnessCenterPreview";
import GymListSkeleton from "../components/GymListSkeleton";
import FiltersSection, { type GymsFiltersValue } from "./FiltersSection";

const MEMBERSHIP_VALUES = new Set(["bronze", "silver", "gold", "platinum"]);

const emptyFilters: GymsFiltersValue = {
  query: "",
  city: "",
  rayon: "",
  category: "",
  membership: "",
};

const toTier = (
  membership: LandingGymV2["minEntryMembership"],
): MembershipTier => {
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

const formatLocation = (gym: LandingGymV2) =>
  [gym.location, gym.rayon, gym.city].filter(Boolean).join(", ") || "—";

const toApiFilters = (filters: GymsFiltersValue): LandingListFilters => ({
  q: filters.query.trim() || undefined,
  city: filters.city || undefined,
  rayon: filters.rayon || undefined,
  category: filters.category || undefined,
  membership: filters.membership || undefined,
});

const mergeById = (current: LandingGymV2[], incoming: LandingGymV2[]) => {
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
  gyms: LandingGymV2[];
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
  pageSize = LANDING_GYMS_V2_PAGE_SIZE,
  cities: citiesFromApi,
  rayonsByCity: rayonsByCityFromApi,
  categories: categoriesFromApi,
}: FitnessCentersListSectionProps) => {
  const { t, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
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
  const [selectedId, setSelectedId] = useState<string | null>(
    initialGyms[0]?.gymId ?? null,
  );
  const skipFirstFetch = useRef(true);

  const syncMembershipUrl = (membership: string) => {
    const current = searchParams.get("membership")?.toLowerCase() ?? "";
    const nextValue = membership || "";
    if (current === nextValue) return;
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue) params.set("membership", nextValue);
    else params.delete("membership");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const updateFilters = (next: GymsFiltersValue) => {
    setFilters(next);
    if (next.membership !== filters.membership) {
      syncMembershipUrl(next.membership);
    }
  };

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
      if (
        !apiFilters.q &&
        !apiFilters.city &&
        !apiFilters.rayon &&
        !apiFilters.category &&
        !apiFilters.membership
      ) {
        return;
      }
    }

    let cancelled = false;
    setLoading(true);
    getLandingGymsV2Page(locale, 1, pageSize, apiFilters)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setPage(data.page);
        setTotal(data.total);
        setSelectedId(data.items[0]?.gymId ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    debouncedQuery,
    filters.city,
    filters.rayon,
    filters.category,
    filters.membership,
    locale,
    pageSize,
  ]);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !items.some((gym) => gym.gymId === selectedId)) {
      setSelectedId(items[0].gymId);
    }
  }, [items, selectedId]);

  const cities = useMemo(
    () =>
      citiesFromApi && citiesFromApi.length > 0
        ? citiesFromApi
        : uniqueSorted(items.map((gym) => gym.city)),
    [citiesFromApi, items],
  );
  const rayons = useMemo(() => {
    if (!isBakiCity(filters.city)) return [];
    const fromApi =
      rayonsByCityFromApi?.["Bakı"] || rayonsByCityFromApi?.[filters.city];
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

  const selectedGym = useMemo(
    () => items.find((gym) => gym.gymId === selectedId) ?? null,
    [items, selectedId],
  );

  const hasMore = items.length < total;
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || items.length >= total) return;
    setLoading(true);
    try {
      const data = await getLandingGymsV2Page(
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
  }, [
    debouncedQuery,
    filters,
    items.length,
    locale,
    page,
    pageSize,
    total,
  ]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);
  const showListSkeleton = loading && items.length === 0;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
      <aside className="flex w-full flex-col overflow-hidden rounded-[22px] border border-[rgba(220,230,235,0.9)] bg-surface lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:w-[628px] lg:shrink-0">
        <div className="flex flex-col gap-5 overflow-y-auto p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3 px-3">
            <div>
              <p className="text-xl font-bold leading-[30px] text-[#13A9A5]">
                {t.centers.listTitle}
              </p>
              <p className="pt-1 text-base font-normal leading-6 text-[#0B2340] dark:text-ink">
                {t.centers.listSubtitle}
              </p>
            </div>
          </div>

          <FiltersSection
            compact
            value={filters}
            cities={cities}
            rayons={rayons}
            categories={categories}
            onChange={updateFilters}
            onReset={() => {
              setFilters(emptyFilters);
              syncMembershipUrl("");
            }}
          />

          {showListSkeleton ? (
            <GymListSkeleton />
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((gym) => (
                <FitnessCenterCard
                  key={gym.gymId}
                  variant="list"
                  name={gym.name}
                  location={formatLocation(gym)}
                  image={gym.coverImageUrl || ""}
                  category={gym.category || ""}
                  categoryItems={gym.categoryItems}
                  membership={toTier(gym.minEntryMembership)}
                  href={addLocaleToPathname(
                    `/fitness-centers/${gym.gymId}`,
                    locale,
                  )}
                  selected={gym.gymId === selectedId}
                  onSelect={() => setSelectedId(gym.gymId)}
                />
              ))}
              {items.length === 0 && !loading ? (
                <p className="px-3 py-8 text-center text-sm text-desc">
                  {t.centers.listEmpty}
                </p>
              ) : null}
            </div>
          )}

          {hasMore ? (
            <div
              ref={sentinelRef}
              className="flex min-h-12 items-center justify-center py-2"
              aria-hidden={!loading}
            >
              {loading && items.length > 0 ? (
                <span className="text-sm font-medium text-ink/60">
                  {t.centers.loadMore}…
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <FitnessCenterPreview gym={selectedGym} />
      </div>
    </div>
  );
};

export default FitnessCentersListSection;
