"use client";

import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants/app-links";
import { cn } from "@/lib/utils";

type AppPhonesShowcaseProps = {
  className?: string;
};

/** Transparent screen hole inside the iPhone PNGs (1350×2760). */
const SCREEN_INSET = {
  left: "5.33%",
  top: "7.97%",
  width: "89.26%",
  height: "86.67%",
} as const;

type PhoneProps = {
  frameSrc: string;
  screenSrc: string;
  className?: string;
  alt?: string;
};

const Phone = ({ frameSrc, screenSrc, className, alt = "" }: PhoneProps) => (
  <div className={cn("absolute w-[41.5%]", className)}>
    <div className="relative aspect-[1350/2760] w-full">
      <div
        className="absolute z-0 overflow-hidden"
        style={{
          left: SCREEN_INSET.left,
          top: SCREEN_INSET.top,
          width: SCREEN_INSET.width,
          height: SCREEN_INSET.height,
          borderRadius: "18% / 9%",
        }}
      >
        <img
          src={screenSrc}
          alt={alt}
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
      </div>
      <img
        src={frameSrc}
        alt=""
        aria-hidden
        className="pointer-events-none relative z-10 h-auto w-full select-none"
        draggable={false}
      />
    </div>
  </div>
);

const ThemePhones = ({
  theme,
  className,
}: {
  theme: "light" | "dark";
  className?: string;
}) => {
  const base = `/images/home/fitnest-app/${theme}`;

  return (
    <div className={cn("absolute inset-0", className)}>
      {/* Deep Blue — left, -12deg */}
      <Phone
        frameSrc={`${base}/iphone-deep-blue.png`}
        screenSrc={`${base}/screen-gyms.png`}
        className="left-[-1.6%] top-[11.8%] origin-top-left -rotate-12"
        alt="FitNest nearby gyms"
      />
      {/* Cosmic Orange — right, +7deg */}
      <Phone
        frameSrc={`${base}/iphone-cosmic-orange.png`}
        screenSrc={`${base}/screen-detail.png`}
        className="left-[60.7%] top-[-5%] origin-top-left rotate-[7deg]"
        alt="FitNest gym details"
      />
    </div>
  );
};

const AppPhonesShowcase = ({ className }: AppPhonesShowcaseProps) => {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[608/538] w-full max-w-[608px] overflow-visible",
        className,
      )}
    >
      <ThemePhones theme="light" className="dark:hidden" />
      <ThemePhones theme="dark" className="hidden dark:block" />
    </div>
  );
};

export const AppStoreRow = ({
  qrTitle,
  qrSubtitle,
  className,
}: {
  qrTitle: string;
  qrSubtitle: string;
  className?: string;
}) => {
  const badges = (theme: "light" | "dark", extraClass: string) => {
    const base = `/images/home/fitnest-app/${theme}`;
    return (
      <div
        className={cn(
          "flex w-full max-w-[601px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          extraClass,
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="size-[55px] overflow-hidden rounded-sm border border-[#EAEAEA] dark:border-[#22262F]">
            <img
              src={`${base}/qr.svg`}
              alt=""
              width={55}
              height={55}
              className="size-full object-contain"
            />
          </div>
          <div className="flex w-[169px] flex-col gap-0.5">
            <p className="text-sm font-bold leading-5 text-white dark:text-[#011729]">
              {qrTitle}
            </p>
            <p className="text-sm font-medium leading-5 text-[#90A1B9] dark:text-[#10334D]">
              {qrSubtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Google Play"
          >
            <img
              src={`${base}/google-play.svg`}
              alt="Get it on Google Play"
              width={135}
              height={40}
              className="h-10 w-[135px] object-contain"
            />
          </a>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="App Store"
          >
            <img
              src={`${base}/app-store.svg`}
              alt="Download on the App Store"
              width={120}
              height={40}
              className="h-10 w-[120px] object-contain"
            />
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      {badges("light", "dark:hidden")}
      {badges("dark", "hidden dark:flex")}
    </>
  );
};

export default AppPhonesShowcase;
