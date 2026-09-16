import { getMessages } from "@/lib/i18n/server";
import Container from "@/components/common/Container";
import SectionHeading from "../components/SectionHeading";
import IconBox from "../components/IconBox";
import { Stagger } from "../components/Reveal";
import TiltCard from "../components/TiltCard";

const STEP_ICONS = [
  "/icons/home/user.svg",
  "/icons/home/layers.svg",
  "/icons/home/map-pin-how.svg",
  "/icons/home/qr.svg",
];

const HowItWorks = async () => {
  const { messages } = await getMessages();
  const t = messages.home;

  return (
    <section id="how-it-works" className="scroll-mt-28 overflow-x-clip bg-page py-16 md:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={t.howEyebrow}
          title={t.howHeading}
          titleClassName="font-manrope text-heading"
        />
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" variant="scale" delay={0.1}>
          {t.howItems.map((item, index) => {
            const isLast = index === t.howItems.length - 1;

            return (
              <TiltCard key={item.title} intensity={8}>
              <article
                className={`group flex min-h-0 flex-col gap-1 rounded-[20px] px-5 py-6 transition-all duration-300 sm:min-h-[216px] sm:px-[26px] sm:py-7 ${
                  isLast
                    ? "bg-brand-navy text-white hover:bg-energy hover:shadow-[0px_18px_40px_rgba(255,106,66,0.28)] dark:bg-[#F4F7FB] dark:text-brand-navy dark:hover:bg-energy dark:hover:text-white"
                    : "border border-border-muted bg-surface hover:shadow-[0px_18px_40px_rgba(0,157,166,0.16)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <IconBox
                    tone={isLast ? "light" : "cyan"}
                    className={
                      isLast
                        ? "transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white dark:bg-cyan/15 dark:text-turquoise dark:group-hover:bg-white/20 dark:group-hover:text-white"
                        : undefined
                    }
                  >
                    <img src={STEP_ICONS[index]} alt="" width={22} height={22} />
                  </IconBox>
                  <span
                    className={`text-[15px] font-extrabold transition-colors duration-300 ${
                      isLast
                        ? "text-white/70 group-hover:text-white dark:text-[#85888E] dark:group-hover:text-white"
                        : "text-[#85888E] dark:text-title"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <h3
                  className={`pt-3 font-manrope text-xl font-extrabold leading-[30px] transition-colors duration-300 ${
                    isLast
                      ? "text-white group-hover:text-white dark:text-brand-navy dark:group-hover:text-white"
                      : "text-ink"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`whitespace-pre-line text-sm leading-5 transition-colors duration-300 ${
                    isLast
                      ? "text-white/85 group-hover:text-white dark:text-title dark:group-hover:text-white"
                      : "text-title"
                  }`}
                >
                  {item.desc}
                </p>
              </article>
              </TiltCard>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
};

export default HowItWorks;
