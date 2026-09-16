import { getMessages } from "@/lib/i18n/server";
import Container from "@/components/common/Container";
import { Stagger } from "../components/Reveal";
import AppPhonesShowcase, {
  AppStoreRow,
} from "../components/AppPhonesShowcase";

const FEATURE_ICONS = [
  "icon-search.svg",
  "icon-qr.svg",
  "icon-bag.svg",
  "icon-chart.svg",
] as const;

const AppSection = async () => {
  const { messages } = await getMessages();
  const t = messages.home;

  return (
    <section className="relative overflow-hidden bg-[#011729] py-16 md:py-20 dark:bg-[#F4F7FB]">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-249px] right-[-40px] hidden h-[523px] w-[668px] rounded-full bg-[linear-gradient(180deg,rgba(4,34,86,0.61)_0%,rgba(0,106,133,0.38)_55%,rgba(0,163,179,0.01)_100%)] blur-[150px] dark:block"
      />

      <Container className="relative z-10 flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:gap-16">
        <div className="flex w-full max-w-[640px] shrink flex-col gap-5 lg:max-w-[52%]">
          <div className="flex max-w-[640px] flex-col gap-4">
            <p className="text-lg font-bold leading-7 text-[#00DBDB] dark:text-[#00A4A4]">
              {t.appEyebrow}
            </p>
            <h2 className="whitespace-pre-line font-manrope text-[28px] font-extrabold leading-[1.3] text-white sm:text-[32px] md:text-[40px] md:leading-[60px] dark:text-[#011729]">
              {t.appHeading}
            </h2>
            <p className="max-w-[477px] text-base font-normal leading-6 text-[#90A1B9] dark:text-[#10334D]">
              {t.appDescription}
            </p>
          </div>

          <Stagger className="flex flex-col gap-[18px]" variant="left" delay={0.08}>
            {t.appFeatures.map((feature, index) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,219,219,0.15)]">
                  <img
                    src={`/images/home/fitnest-app/light/${FEATURE_ICONS[index]}`}
                    alt=""
                    width={18}
                    height={18}
                    className="size-[18px] dark:hidden"
                  />
                  <img
                    src={`/images/home/fitnest-app/dark/${FEATURE_ICONS[index]}`}
                    alt=""
                    width={18}
                    height={18}
                    className="hidden size-[18px] dark:block"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-base font-bold leading-6 text-white dark:text-[#011729]">
                    {feature.title}
                  </p>
                  <p className="max-w-[486px] text-sm font-normal leading-5 text-[#90A1B9] dark:text-[#10334D]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </Stagger>

          <AppStoreRow
            qrTitle={t.qrDownloadTitle}
            qrSubtitle={t.qrDownloadSubtitle}
            className="mt-1"
          />
        </div>

        <div className="w-full max-w-[608px] shrink lg:max-w-[46%]">
          <AppPhonesShowcase />
        </div>
      </Container>
    </section>
  );
};

export default AppSection;
