import { localeHeaders, serverApiClientV2, apiClient } from "@/lib/api";
import {
  gymImageSrc,
  type LandingCategoryItem,
  type LandingGymFilters,
  type LandingListFilters,
  type MembershipTier,
} from "@/lib/api/landing";

/** Browser proxy segments → `/api/v2/public/landing/...` (see proxy-allowlist). */
const LANDING_V2 = "v2/public/landing";

export type LandingGymV2 = {
  gymId: string;
  name: string;
  coverImageUrl: string | null;
  location: string | null;
  city: string | null;
  rayon: string | null;
  category: string | null;
  categories: string[];
  categoryItems?: LandingCategoryItem[];
  /** Lowest package that unlocks entry. */
  minEntryMembership: MembershipTier;
};

export type LandingGymDetailV2 = LandingGymV2 & {
  galleryImageUrls: string[];
  latitude: number | null;
  longitude: number | null;
  workHours: string[];
  accessMemberships: MembershipTier[];
  description: string | null;
  amenities: string[];
  note?: string | null;
};

export type LandingPageV2<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export const LANDING_GYMS_V2_PAGE_SIZE = 12;
const LANDING_MAX_PAGE_SIZE = 50;

function clampPageSize(pageSize: number) {
  return Math.min(Math.max(pageSize, 1), LANDING_MAX_PAGE_SIZE);
}

function toTier(value: string | null | undefined): MembershipTier {
  if (value === "silver" || value === "gold" || value === "platinum") {
    return value;
  }
  return "bronze";
}

function mapCard(raw: LandingGymV2): LandingGymV2 {
  return {
    ...raw,
    coverImageUrl: gymImageSrc(raw.coverImageUrl),
    categories: raw.categories ?? [],
    categoryItems: (raw.categoryItems ?? []).map((item) => ({
      name: item.name,
      iconUrl: item.iconUrl ? gymImageSrc(item.iconUrl) : null,
    })),
    minEntryMembership: toTier(raw.minEntryMembership),
    category:
      raw.categories && raw.categories.length > 0
        ? raw.categories.join(" & ")
        : raw.category ?? null,
  };
}

function mapDetail(raw: LandingGymDetailV2): LandingGymDetailV2 {
  const gallery = [raw.coverImageUrl, ...(raw.galleryImageUrls ?? [])]
    .filter(Boolean)
    .map((url) => gymImageSrc(url as string));
  return {
    ...mapCard(raw),
    galleryImageUrls: [...new Set(gallery)],
    workHours: raw.workHours ?? [],
    accessMemberships: (raw.accessMemberships ?? []).map(toTier),
    amenities: raw.amenities ?? [],
    note: raw.note ?? null,
    description: raw.description ?? null,
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
  };
}

function listParams(
  page: number,
  pageSize: number,
  filters?: LandingListFilters,
) {
  return {
    page: Math.max(page, 1),
    page_size: clampPageSize(pageSize),
    ...(filters?.q?.trim() ? { q: filters.q.trim() } : {}),
    ...(filters?.city?.trim() ? { city: filters.city.trim() } : {}),
    ...(filters?.rayon?.trim() ? { rayon: filters.rayon.trim() } : {}),
    ...(filters?.category?.trim() ? { category: filters.category.trim() } : {}),
    ...(filters?.membership?.trim()
      ? { membership: filters.membership.trim() }
      : {}),
  };
}

function emptyPage(page: number, pageSize: number): LandingPageV2<LandingGymV2> {
  return { items: [], total: 0, page, pageSize };
}

function withLocale(locale: string, params?: Record<string, unknown>) {
  return {
    headers: localeHeaders(locale),
    ...(params ? { params } : {}),
  };
}

export async function getLandingGymsV2PageServer(
  locale: string,
  page = 1,
  pageSize = LANDING_GYMS_V2_PAGE_SIZE,
  filters?: LandingListFilters,
): Promise<LandingPageV2<LandingGymV2>> {
  try {
    const { data } = await serverApiClientV2.get<LandingPageV2<LandingGymV2>>(
      `/public/landing/gyms`,
      withLocale(locale, listParams(page, pageSize, filters)),
    );
    return {
      items: (data.items ?? []).map(mapCard),
      total: data.total ?? data.items?.length ?? 0,
      page: data.page ?? page,
      pageSize: data.pageSize ?? pageSize,
    };
  } catch {
    return emptyPage(page, pageSize);
  }
}

export async function getLandingGymsV2Page(
  locale: string,
  page = 1,
  pageSize = LANDING_GYMS_V2_PAGE_SIZE,
  filters?: LandingListFilters,
): Promise<LandingPageV2<LandingGymV2>> {
  try {
    const { data } = await apiClient.get<LandingPageV2<LandingGymV2>>(
      `${LANDING_V2}/gyms`,
      withLocale(locale, listParams(page, pageSize, filters)),
    );
    return {
      items: (data.items ?? []).map(mapCard),
      total: data.total ?? data.items?.length ?? 0,
      page: data.page ?? page,
      pageSize: data.pageSize ?? pageSize,
    };
  } catch {
    return emptyPage(page, pageSize);
  }
}

export async function getLandingGymFiltersV2Server(
  locale: string,
): Promise<LandingGymFilters> {
  try {
    const { data } = await serverApiClientV2.get<LandingGymFilters>(
      `/public/landing/gyms/filters`,
      withLocale(locale),
    );
    return {
      cities: data.cities ?? [],
      rayonsByCity: data.rayonsByCity ?? {},
      categories: data.categories ?? [],
      memberships: (data.memberships ?? []).filter(
        (value): value is MembershipTier =>
          value === "bronze" ||
          value === "silver" ||
          value === "gold" ||
          value === "platinum",
      ),
    };
  } catch {
    return { cities: [], rayonsByCity: {}, categories: [], memberships: [] };
  }
}

export async function getLandingGymV2(
  locale: string,
  gymId: string,
): Promise<LandingGymDetailV2 | null> {
  if (!/^[1-9][0-9]{0,17}$/.test(gymId)) return null;
  try {
    const { data } = await apiClient.get<LandingGymDetailV2>(
      `${LANDING_V2}/gyms/${gymId}`,
      withLocale(locale),
    );
    return mapDetail(data);
  } catch {
    return null;
  }
}
