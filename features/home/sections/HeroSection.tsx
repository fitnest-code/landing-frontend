import Link from "next/link";
import { getMessages } from "@/lib/i18n/server";
import { addLocaleToPathname } from "@/lib/i18n/config";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";
import PhoneScreensCarousel from "../components/PhoneScreensCarousel";

const HeroSection = async () => {
  const { messages, locale } = await getMessages();
  const t = messages.home;
  const homePath = addLocaleToPathname("/", locale);

  return (
    <section className="relative overflow-hidden bg-page">
      <img
        src="/images/home/hero-bg.svg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-right dark:hidden"
      />
      <img
        src="/images/home/hero-bg-dark.svg"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover object-right dark:block"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] px-5 py-10 md:px-10 md:py-16 lg:grid-cols-[minmax(20rem,519px)_minmax(0,1fr)] lg:items-center lg:gap-[80px] xl:gap-[206px] xl:px-20">
        <Reveal variant="blur" amount={0.05} className="flex w-full max-w-[519px] flex-col">
        <div className="flex w-full max-w-[519px] flex-col gap-8">
          <div className="flex flex-col gap-8">
            <h1 className="relative font-manrope text-[28px] font-extrabold leading-[1.15] text-heading sm:text-[32px] md:text-[40px] md:leading-[1.2] lg:text-[58px] lg:leading-[61.48px]">
              <span className="block">
                {t.heroLine1Before}{" "}
                <span className="text-turquoise">{t.heroLine1Accent}.</span>
              </span>
              <span className="block">{t.heroLine2}</span>
              <span className="relative inline-block pb-3">
                {t.heroLine3}
                <span className="absolute bottom-0 left-0 h-3 w-full max-w-[469px] rounded-[3px] bg-energy" />
              </span>
            </h1>
            <p className="whitespace-pre-line text-base font-normal leading-6 text-title dark:text-ink">
              {t.heroDescription}
            </p>
          </div>

          <Link
            href={`${homePath}#how-it-works`}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-button px-4 text-base font-bold text-white transition-colors hover:bg-[#FF6A42]"
          >
            {messages.nav.howItWorks}
            <img
              src="/icons/home/arrow-right.svg"
              alt=""
              width={24}
              height={24}
              className="brightness-0 invert"
            />
          </Link>
        </div>
        </Reveal>

        <Reveal
          variant="right"
          delay={0.12}
          amount={0.05}
          className="relative mx-auto mt-8 w-full max-w-[555px] lg:mx-0 lg:ml-auto lg:mt-0"
        >
          <TiltCard intensity={6}>
            {/* Composition stage: phone sits inset like the original hero mockup */}
            <div className="relative mx-auto aspect-[555/625] w-full max-w-[555px]">
              <div className="absolute top-0 left-[22.78%] h-full w-[54.43%]">
                <PhoneScreensCarousel />
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
};

export default HeroSection;
