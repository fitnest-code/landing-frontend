"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Outer device chrome — stays fixed while screens crossfade inside. */
const PHONE_FRAME = "/images/home/iphone/frame.svg";

/** Inner UI pages only (279×606 inside 304×627 frame). Home first; skip the oversized welcome-coin popup. */
const SCREENS = [
  "/images/home/iphone/screen-2.svg",
  "/images/home/iphone/screen-6.svg",
  "/images/home/iphone/screen-3.svg",
  "/images/home/iphone/screen-4.svg",
  "/images/home/iphone/screen-5.svg",
  "/images/home/iphone/screen.svg",
] as const;

/** Screen inset inside the frame — 12.5×10.5 padding on the 304×627 chrome. */
const SCREEN_INSET = {
  left: "4.11%",
  top: "1.67%",
  width: "91.78%",
  height: "96.65%",
} as const;

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
    const sources = [PHONE_FRAME, ...SCREENS];
    const preload = sources.map(
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
    <div className={cn("relative h-full w-full", className)}>
      {/* Inner UI pages — behind the transparent screen hole */}
      <div
        className="absolute z-0 overflow-hidden"
        style={{
          left: SCREEN_INSET.left,
          top: SCREEN_INSET.top,
          width: SCREEN_INSET.width,
          height: SCREEN_INSET.height,
          borderRadius: "12% / 5.5%",
        }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={SCREENS[index]}
            src={SCREENS[index]}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ x: "-28%", opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "28%", opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        <AnimatePresence>
          {!ready ? (
            <motion.div
              key="spinner"
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#011729]/15"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src="/Loading.gif"
                alt=""
                className="h-14 w-14 object-contain sm:h-16 sm:w-16"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Static iPhone frame on top — never animates */}
      <img
        src={PHONE_FRAME}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
};

export default PhoneScreensCarousel;
export { PHONE_FRAME, SCREENS as PHONE_SCREENS };
