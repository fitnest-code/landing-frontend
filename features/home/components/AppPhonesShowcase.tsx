"use client";

import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants/app-links";
import { cn } from "@/lib/utils";

type AppPhonesShowcaseProps = {
  className?: string;
};

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
      {/* Left phone — Deep Blue, tilted -12deg */}
      <div className="absolute left-[-1.6%] top-[11.8%] h-[96.8%] w-[41.4%] origin-top-left -rotate-12">
        <img
          src={`${base}/screen-left.svg`}
          alt=""
          className="absolute left-[4.9%] top-[2.5%] h-[94.9%] w-[90.2%] object-cover"
          draggable={false}
        />
        <img
          src={`${base}/frame-left.svg`}
          alt=""
          aria-hidden
          className="relative z-10 h-full w-full object-contain"
          draggable={false}
        />
      </div>

      {/* Right phone — Cosmic Orange, tilted 7deg */}
      <div className="absolute left-[60.7%] top-[-5%] h-[96.8%] w-[41.4%] origin-top-left rotate-[7deg]">
        <img
          src={`${base}/screen-right.svg`}
          alt=""
          className="absolute left-[5.2%] top-[2.9%] h-[94.1%] w-[89.6%] object-cover"
          draggable={false}
        />
        <img
          src={`${base}/frame-right.svg`}
          alt=""
          aria-hidden
          className="relative z-10 h-full w-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};

const AppPhonesShowcase = ({ className }: AppPhonesShowcaseProps) => {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[608/538] w-full max-w-[608px]",
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
