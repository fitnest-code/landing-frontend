import Container from "@/components/common/Container";
import type { GoalItem } from "./api/types";
import BmiCalculatorSection from "./sections/BmiCalculatorSection";
import BmiHeroSection from "./sections/BmiHeroSection";
import BmiTipsSection from "./sections/BmiTipsSection";

interface BmiPageProps {
  initialGoals?: GoalItem[];
  initialLocale?: string;
}

const BmiPage = ({ initialGoals, initialLocale }: BmiPageProps) => {
  return (
    <div className="overflow-x-clip bg-page text-ink">
      <BmiHeroSection />
      <Container className="flex flex-col gap-6 pb-16 pt-8 md:pb-24">
        <BmiCalculatorSection initialGoals={initialGoals} initialLocale={initialLocale} />
        <BmiTipsSection />
      </Container>
    </div>
  );
};

export default BmiPage;
