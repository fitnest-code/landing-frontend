"use client";

import PhoneScreensCarousel, {
  PHONE_SCREENS,
} from "../components/PhoneScreensCarousel";
import { cn } from "@/lib/utils";

type AppPhonesShowcaseProps = {
  className?: string;
};

const AppPhonesShowcase = ({ className }: AppPhonesShowcaseProps) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-[88%] w-full max-w-[560px]">
          <img
            src={PHONE_SCREENS[1]}
            alt=""
            className="absolute top-[8%] left-[2%] h-[78%] w-auto -rotate-8 opacity-70 drop-shadow-xl sm:left-[4%]"
          />
          <img
            src={PHONE_SCREENS[3]}
            alt=""
            className="absolute top-[4%] right-[2%] h-[82%] w-auto rotate-[10deg] opacity-75 drop-shadow-xl sm:right-[4%]"
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
