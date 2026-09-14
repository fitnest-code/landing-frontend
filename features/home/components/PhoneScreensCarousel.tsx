"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  intervalMs = 3600,
  alt = "FitNest app",
}: PhoneScreensCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

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
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % SCREENS.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [ready, intervalMs]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* Crossfade: keep both screens stacked so there is no blank gap */}
      <AnimatePresence initial={false}>
        <motion.img
          key={SCREENS[index]}
          src={SCREENS[index]}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain"
          initial={{ opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 1.01 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      <AnimatePresence>
        {!ready ? (
          <motion.div
            key="spinner"
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#011729]/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/Loading.gif"
              alt=""
              className="h-16 w-16 object-contain sm:h-20 sm:w-20"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default PhoneScreensCarousel;
export { SCREENS as PHONE_SCREENS };
