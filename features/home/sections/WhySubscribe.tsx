import { getMessages } from "@/lib/i18n/server";
import Container from "@/components/common/Container";
import { getLandingStatsServer } from "@/lib/api/landing";
import { withGymCount } from "@/lib/i18n/with-gym-count";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";

const WhySubscribe = async () => {
  const { messages, locale } = await getMessages();
  const t = messages.home;
  const stats = await getLandingStatsServer(locale);
  const whyRightItems = t.whyRightItems.map((item) =>
    withGymCount(item, stats?.gymCount),
  );

  return (
    <section className="overflow-x-clip bg-surface py-16 md:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={t.whyEyebrow}
          title={t.whyHeading}
          titleClassName="font-manrope text-heading"
        />
        <div className="relative mx-auto w-full max-w-[1036px]">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-0 lg:py-6">
            <Reveal
              variant="left"
              className="flex h-full w-full flex-col lg:relative lg:z-0 lg:mr-[-8%]"
            >
              <article className="flex h-full min-h-[280px] w-full flex-col rounded-[30px] border border-energy bg-surface p-6 shadow-[0px_28px_76px_rgba(0,157,166,0.24)] sm:min-h-[360px] sm:p-8 md:p-10 lg:-rotate-2 dark:bg-page dark:shadow-none">
                <h3 className="mb-5 font-manrope text-[28px] font-extrabold leading-[1.3] text-ink sm:text-[32px] md:text-[40px] md:leading-[60px]">
                  {t.whyLeftTitle}
                </h3>
                <ul className="flex flex-1 flex-col gap-4">
                  {t.whyLeftItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <img
                        src="/icons/home/close-circle.svg"
                        alt=""
                        width={29}
                        height={29}
                        className="mt-0.5 size-7 shrink-0"
                      />
                      <span className="text-base font-semibold leading-6 text-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>

            <Reveal
              variant="right"
              delay={0.12}
              className="flex h-full w-full flex-col lg:relative lg:z-10 lg:-ml-[8%]"
            >
              <article className="flex h-full min-h-[280px] w-full flex-col rounded-[30px] border border-cyan bg-[linear-gradient(315deg,#00DBDB_0%,#14234B_100%)] p-6 shadow-[0px_28px_76px_rgba(0,157,166,0.24)] sm:min-h-[360px] sm:p-8 md:p-10 lg:rotate-2">
                <h3 className="mb-5 font-manrope text-[28px] font-extrabold leading-[1.3] text-white sm:text-[32px] md:text-[40px] md:leading-[60px]">
                  {t.whyRightTitle}
                </h3>
                <ul className="flex flex-1 flex-col gap-4">
                  {whyRightItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-[27px] shrink-0 items-center justify-center rounded-full border border-white bg-[rgba(13,24,52,0.2)]">
                        <img
                          src="/icons/home/check-white.svg"
                          alt=""
                          width={18}
                          height={18}
                        />
                      </span>
                      <span className="text-base font-semibold leading-6 text-white">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhySubscribe;
