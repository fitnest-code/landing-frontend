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
          className="h-[260px] w-full lg:h-[360px]"
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
              className="absolute left-4 top-1/2 z-10 flex h-[58px] w-7 -translate-y-1/2 items-center justify-center rounded-[43px] bg-white"
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
              className="absolute right-4 top-1/2 z-10 flex h-[58px] w-7 -translate-y-1/2 items-center justify-center rounded-[43px] bg-white"
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

      {slides.length > 1 ? (
        <div className="grid grid-cols-2 gap-4">
          {slides.slice(0, 2).map((image, index) => (
            <button
              key={`thumb-${image}-${index}`}
              type="button"
              onClick={() => swiperInstance?.slideTo(index)}
              className={`relative h-[110px] w-full overflow-hidden rounded-xl md:h-[140px] ${
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
      ) : null}
    </div>
  );
};

export default FitnessGallery;
