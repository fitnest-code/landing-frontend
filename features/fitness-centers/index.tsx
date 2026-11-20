import { Suspense } from "react";
import Container from "@/components/common/Container";
import { getMessages } from "@/lib/i18n/server";
import { getLandingStatsServer, type LandingListFilters } from "@/lib/api/landing";
import {
  LANDING_GYMS_V2_PAGE_SIZE,
  getLandingGymFiltersV2Server,
  getLandingGymsV2PageServer,
} from "@/lib/api/landing-v2";
import FitnessCentersHeroSection from "./sections/FitnessCentersHeroSection";
import FitnessCentersListSection from "./sections/FitnessCentersListSection";
import GymListSkeleton from "./components/GymListSkeleton";
import GymPreviewSkeleton from "./components/GymPreviewSkeleton";

const MEMBERSHIP_VALUES = new Set(["bronze", "silver", "gold", "platinum"]);

type FitnessCentersPageProps = {
  membership?: string | null;
};

const ListFallback = () => (
  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
    <aside className="w-full overflow-hidden rounded-[22px] border border-[rgba(220,230,235,0.9)] bg-surface p-4 lg:w-[628px] lg:shrink-0">
      <div className="mb-5 space-y-2 px-3">
        <div className="h-7 w-40 animate-pulse rounded-md bg-page" />
        <div className="h-5 w-52 animate-pulse rounded-md bg-page" />
      </div>
      <div className="mb-5 h-12 animate-pulse rounded-[32px] bg-page" />
      <GymListSkeleton />
    </aside>
    <div className="min-w-0 flex-1">
      <GymPreviewSkeleton />
    </div>
  </div>
);

const FitnessCentersPage = async ({ membership }: FitnessCentersPageProps) => {
  const { locale } = await getMessages();
  const membershipFilter =
    membership && MEMBERSHIP_VALUES.has(membership.toLowerCase())
      ? membership.toLowerCase()
      : undefined;
  const listFilters: LandingListFilters | undefined = membershipFilter
    ? { membership: membershipFilter }
    : undefined;

  const [stats, gymsPage, gymFilters] = await Promise.all([
    getLandingStatsServer(locale),
    getLandingGymsV2PageServer(locale, 1, LANDING_GYMS_V2_PAGE_SIZE, listFilters),
    getLandingGymFiltersV2Server(locale),
  ]);

  return (
    <div className="bg-page text-ink">
      <FitnessCentersHeroSection
        gymCount={
          stats?.gymCount && stats.gymCount > 0
            ? stats.gymCount
            : gymsPage.total > 0
              ? gymsPage.total
              : gymsPage.items.length || null
        }
      />
      <Container className="pb-16 pt-6 md:pb-24 md:pt-8">
        <Suspense fallback={<ListFallback />}>
          <FitnessCentersListSection
            gyms={gymsPage.items}
            total={gymsPage.total}
            page={gymsPage.page}
            pageSize={gymsPage.pageSize || LANDING_GYMS_V2_PAGE_SIZE}
            cities={gymFilters.cities}
            rayonsByCity={gymFilters.rayonsByCity}
            categories={gymFilters.categories}
          />
        </Suspense>
      </Container>
    </div>
  );
};

export default FitnessCentersPage;
