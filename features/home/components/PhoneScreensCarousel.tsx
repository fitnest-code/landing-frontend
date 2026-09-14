"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SCREENS = [
  "/images/home/iphone-screens/screen-1.svg",
  "/images/home/iphone-screens/screen-2.svg",
  "/images/home/iphone-screens/screen-3.svg",
  "/images/home/iphone-screens/screen-4.svg",
  "/images/home/iphone-screens/screen-5.svg",
  "/images/home/iphone-screens/screen-6.svg",
  "/images/home/iphone-screens/screen-7.svg",
] as const;

type PhoneScreensCarouselProps = {
  className?: string;
  intervalMs?: number;
  alt?: string;
};

const PhoneScreensCarousel = ({
  className,
  intervalMs = 3200,
  alt = "FitNest app",
}: PhoneScreensCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const preload = SCREENS.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }),
    );
    void Promise.all(preload).then(() => {
      if (cancelled) return;
      setReady(true);
      setSpinning(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      setSpinning(true);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % SCREENS.length);
        setSpinning(false);
      }, 280);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [ready, intervalMs]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {SCREENS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 h-full w-full object-contain transition-opacity duration-300",
            i === index && !spinning ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#011729]/15 backdrop-blur-[1px] transition-opacity duration-200",
          spinning || !ready ? "opacity-100" : "opacity-0",
        )}
      >
        <img
          src="/Loading.gif"
          alt=""
          className="h-16 w-16 object-contain sm:h-20 sm:w-20"
        />
      </div>
    </div>
  );
};

export default PhoneScreensCarousel;
export { SCREENS as PHONE_SCREENS };
