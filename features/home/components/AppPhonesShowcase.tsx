"use client";

import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants/app-links";
import { cn } from "@/lib/utils";

type AppPhonesShowcaseProps = {
  className?: string;
};

const AppPhonesShowcase = ({ className }: AppPhonesShowcaseProps) => {
  return (
    <img
      src="/images/home/fitnest-app/Container.png"
      alt="FitNest app"
      className={cn("h-auto w-full", className)}
      draggable={false}
    />
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
