"use client";

import PhoneScreensCarousel, {
  PHONE_FRAME,
  PHONE_SCREENS,
} from "../components/PhoneScreensCarousel";
import { cn } from "@/lib/utils";

type AppPhonesShowcaseProps = {
  className?: string;
};

const SidePhone = ({
  screenSrc,
  className,
}: {
  screenSrc: string;
  className?: string;
}) => (
  <div className={cn("relative aspect-[304/627] w-auto", className)}>
    <img
      src={screenSrc}
      alt=""
      className="absolute left-[4.11%] top-[1.67%] h-[96.65%] w-[91.78%] rounded-[12%/6%] object-cover"
      draggable={false}
    />
    <img
      src={PHONE_FRAME}
      alt=""
      aria-hidden
      className="relative z-10 h-full w-full object-contain"
      draggable={false}
    />
  </div>
);

const AppPhonesShowcase = ({ className }: AppPhonesShowcaseProps) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[88%] w-full max-w-[560px] items-center justify-center">
          <SidePhone
            screenSrc={PHONE_SCREENS[1]}
            className="absolute left-[2%] top-[8%] h-[78%] -rotate-8 opacity-70 drop-shadow-xl sm:left-[4%]"
          />
          <SidePhone
            screenSrc={PHONE_SCREENS[3]}
            className="absolute right-[2%] top-[4%] h-[82%] rotate-[10deg] opacity-75 drop-shadow-xl sm:right-[4%]"
          />
        </div>
      </div>
      <div className="relative z-10 h-[95%] w-[46%] max-w-[280px]">
        <PhoneScreensCarousel intervalMs={2800} />
      </div>
    </div>
  );
};

export default AppPhonesShowcase;
