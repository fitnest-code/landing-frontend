"use client";

import { useState } from "react";
import RemoteImage from "@/components/common/RemoteImage";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";

import "swiper/css";

const FALLBACK_GALLERY = [
  "/images/gym-details/zal.png",
  "/images/gym-details/bar.png",
  "/images/gym-details/hamam.png",
  "/images/gym-details/thumbnails.png",
];

interface FitnessGalleryProps {
  images: string[];
  name: string;
  previousLabel: string;
  nextLabel: string;
}

const FitnessGallery = ({
  images,
  name,
  previousLabel,
  nextLabel,
}: FitnessGalleryProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = images.length > 0 ? images : FALLBACK_GALLERY;
  const showNav = slides.length > 1;

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="relative overflow-hidden rounded-2xl">
        <Swiper
          modules={[Navigation]}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-[260px] w-full md:h-[520px]"
        >
          {slides.map((img, index) => (
            <SwiperSlide key={`${img}-${index}`}>
              <div className="relative h-full w-full">
                <RemoteImage
                  src={img}
                  alt={`${name} ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 596px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {showNav ? (
          <>
            <button
              type="button"
              onClick={() => swiperInstance?.slidePrev()}
              aria-label={previousLabel}
              className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-[0_2px_10px_rgba(1,23,41,0.18)]"
            >
              <img
                src="/icons/gym-details/chevron-left.svg"
                alt=""
                width={24}
                height={24}
                className="size-6"
              />
            </button>
            <button
              type="button"
              onClick={() => swiperInstance?.slideNext()}
              aria-label={nextLabel}
              className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-[0_2px_10px_rgba(1,23,41,0.18)]"
            >
              <img
                src="/icons/gym-details/chevron-right.svg"
                alt=""
                width={24}
                height={24}
                className="size-6"
              />
            </button>
          </>
        ) : null}
      </div>

      <div className="flex gap-6 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {slides.map((image, index) => (
          <button
            key={`thumb-${image}-${index}`}
            type="button"
            onClick={() => swiperInstance?.slideTo(index)}
            className={`relative h-[110px] w-[160px] shrink-0 overflow-hidden rounded-xl md:h-[185px] md:w-[302px] ${
              activeIndex === index
                ? "ring-2 ring-turquoise"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            <RemoteImage
              src={image}
              alt={`${name} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="302px"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default FitnessGallery;
