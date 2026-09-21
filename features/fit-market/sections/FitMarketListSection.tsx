"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import {
  LANDING_STORES_PAGE_SIZE,
  getLandingStoresPage,
  type LandingListFilters,
  type LandingStore,
} from "@/lib/api/landing";
import { BAKI_RAYONS, isBakiCity } from "@/lib/constants/az-cities";
import FitMarketCard from "../components/FitMarketCard";
import FiltersSection, { type StoresFiltersValue } from "./FiltersSection";
import { Stagger } from "@/components/animation";

const emptyFilters: StoresFiltersValue = {
  query: "",
  city: "",
  rayon: "",
  category: "",
  membership: "",
};

const uniqueSorted = (values: Array<string | null | undefined>) =>
  [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])].sort(
    (a, b) => a.localeCompare(b, "az"),
  );

const toApiFilters = (filters: StoresFiltersValue): LandingListFilters => ({
  q: filters.query.trim() || undefined,
  city: filters.city || undefined,
  rayon: filters.rayon || undefined,
  category: filters.category || undefined,
  membership: filters.membership || undefined,
});

const mergeById = (current: LandingStore[], incoming: LandingStore[]) => {
  const seen = new Set(current.map((store) => store.storeId));
  const next = [...current];
  for (const store of incoming) {
    if (seen.has(store.storeId)) continue;
    seen.add(store.storeId);
    next.push(store);
  }
  return next;
};

type FitMarketListSectionProps = {
  stores: LandingStore[];
  total: number;
  page: number;
  pageSize?: number;
  cities?: string[];
  rayonsByCity?: Record<string, string[]>;
  categories?: string[];
  memberships?: string[];
};

const FitMarketListSection = ({
  stores: initialStores,
  total: initialTotal,
  page: initialPage,
  pageSize = LANDING_STORES_PAGE_SIZE,
  cities: citiesFromApi,
  rayonsByCity: rayonsByCityFromApi,
  categories: categoriesFromApi,
  memberships: membershipsFromApi,
}: FitMarketListSectionProps) => {
  const { t, locale } = useI18n();
  const [filters, setFilters] = useState<StoresFiltersValue>(emptyFilters);
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);
  const [items, setItems] = useState(initialStores);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const skipFirstFetch = useRef(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(filters.query), 350);
    return () => window.clearTimeout(timer);
  }, [filters.query]);

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
    getLandingStoresPage(locale, 1, pageSize, apiFilters)
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
        : uniqueSorted(items.map((store) => store.city)),
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
        : uniqueSorted(items.map((store) => store.category)),
    [categoriesFromApi, items],
  );
  const memberships = useMemo(
    () =>
      membershipsFromApi && membershipsFromApi.length > 0
        ? membershipsFromApi
        : uniqueSorted(items.flatMap((store) => store.discounts ?? [])),
    [items, membershipsFromApi],
  );

  const hasMore = page * pageSize < total;

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await getLandingStoresPage(
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
    <div className="flex flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-5">
        <FiltersSection
          value={filters}
          cities={cities}
          rayons={rayons}
          categories={categories}
          memberships={memberships}
          onChange={setFilters}
          onReset={() => setFilters(emptyFilters)}
        />

        <Stagger
          key={`${filters.city}-${filters.rayon}-${filters.category}-${filters.membership}-${debouncedQuery}`}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          variant="rise"
          delay={0.06}
          whenInView={false}
        >
          {items.map((store) => (
            <FitMarketCard key={store.storeId} store={store} />
          ))}
        </Stagger>
      </div>

      {hasMore ? (
        <button
          type="button"
          disabled={loading}
          onClick={loadMore}
          className="inline-flex h-12 min-w-[194px] cursor-pointer items-center justify-center rounded-[32px] border border-border-muted bg-surface px-4 text-base font-semibold leading-6 text-ink transition-colors hover:border-cyan hover:text-turquoise disabled:cursor-wait disabled:opacity-70"
        >
          {t.centers.loadMore}
        </button>
      ) : null}
    </div>
  );
};

export default FitMarketListSection;
