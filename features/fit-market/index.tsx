import Container from "@/components/common/Container";
import { getMessages } from "@/lib/i18n/server";
import {
  LANDING_STORES_PAGE_SIZE,
  getLandingStoreFiltersServer,
  getLandingStoresPageServer,
} from "@/lib/api/landing";
import FitMarketHeroSection from "./sections/FitMarketHeroSection";
import FitMarketListSection from "./sections/FitMarketListSection";

const FitMarketPage = async () => {
  const { locale } = await getMessages();
  const [storesPage, storeFilters] = await Promise.all([
    getLandingStoresPageServer(locale, 1, LANDING_STORES_PAGE_SIZE),
    getLandingStoreFiltersServer(locale),
  ]);

  return (
    <div className="bg-page text-ink">
      <FitMarketHeroSection />
      <Container className="flex flex-col gap-10 pb-16 pt-6 md:pb-24 md:pt-8">
        <FitMarketListSection
          stores={storesPage.items}
          total={storesPage.total}
          page={storesPage.page}
          pageSize={storesPage.pageSize || LANDING_STORES_PAGE_SIZE}
          cities={storeFilters.cities}
          categories={storeFilters.categories}
          memberships={storeFilters.memberships}
        />
      </Container>
    </div>
  );
};

export default FitMarketPage;
