import { Suspense } from "react";
import Container from "@/components/common/Container";
import { getMessages } from "@/lib/i18n/server";
import {
  LANDING_GYMS_PAGE_SIZE,
  getLandingGymsPageServer,
  getLandingGymFiltersServer,
  getLandingStatsServer,
  type LandingListFilters,
} from "@/lib/api/landing";
import FitnessCentersHeroSection from "./sections/FitnessCentersHeroSection";
import FitnessCentersListSection from "./sections/FitnessCentersListSection";

const MEMBERSHIP_VALUES = new Set(["bronze", "silver", "gold", "platinum"]);

type FitnessCentersPageProps = {
  membership?: string | null;
};

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
    getLandingGymsPageServer(locale, 1, LANDING_GYMS_PAGE_SIZE, listFilters),
    getLandingGymFiltersServer(locale),
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
      <Container className="flex flex-col gap-10 pb-16 pt-6 md:pb-24 md:pt-8">
        <Suspense fallback={null}>
          <FitnessCentersListSection
            gyms={gymsPage.items}
            total={gymsPage.total}
            page={gymsPage.page}
            pageSize={gymsPage.pageSize || LANDING_GYMS_PAGE_SIZE}
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
