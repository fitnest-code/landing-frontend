"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import RemoteImage from "@/components/common/RemoteImage";
import { storeImageSrc, type LandingStore } from "@/lib/api/landing";
import DiscountBadges from "./DiscountBadges";

type FitMarketCardProps = {
  store: LandingStore;
};

const FitMarketCard = ({ store }: FitMarketCardProps) => {
  const { t } = useI18n();
  const address = [store.addressText, store.rayon, store.city].filter(Boolean).join(", ");
  const description = store.category || t.fitMarket.detailsDescription;
  const workHours = store.workHoursText
    ? `${t.fitMarket.workHours}: ${store.workHoursText}`
    : null;
  const visitUrl = store.socialUrl?.trim() || null;
  const cardClassName =
    "group flex h-full min-w-0 flex-col justify-between gap-6 rounded-[32px] border border-border-muted bg-surface p-4 transition-colors duration-200 hover:border-cyan hover:bg-page hover:shadow-[0px_24px_50px_rgba(0,157,166,0.16)] sm:p-5";

  const content = (
    <>
      <div className="flex flex-col gap-6">
        <div className="relative h-[200px] overflow-hidden rounded-2xl sm:h-[250px]">
          <RemoteImage
            src={storeImageSrc(store.coverImageUrl)}
            fallback="/images/first.png"
            alt={store.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 410px"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <h3 className="min-w-0 truncate text-lg font-semibold leading-7 text-turquoise transition-colors group-hover:text-ink sm:text-xl sm:leading-[30px]">
              {store.name}
            </h3>
            <DiscountBadges discounts={store.discounts ?? []} />
          </div>
          <p className="line-clamp-2 min-h-[20px] text-sm font-medium leading-5 text-ink">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-2 text-sm font-medium leading-5 text-title">
        {address ? (
          <span className="inline-flex min-w-0 items-center gap-2">
            <img
              src="/icons/fitstores/map-pin.svg"
              alt=""
              width={20}
              height={20}
              className="size-5 shrink-0"
            />
            <span className="line-clamp-1">{address}</span>
          </span>
        ) : null}
        {store.phone ? (
          <span className="inline-flex items-center gap-2">
            <img
              src="/icons/fitstores/call.svg"
              alt=""
              width={18}
              height={18}
              className="size-[18px] shrink-0"
            />
            {store.phone}
          </span>
        ) : null}
        {workHours ? (
          <span className="inline-flex items-center gap-2">
            <img
              src="/icons/fitstores/clock.svg"
              alt=""
              width={18}
              height={18}
              className="size-[18px] shrink-0"
            />
            {workHours}
          </span>
        ) : null}
      </div>
    </>
  );

  if (visitUrl) {
    return (
      <a
        href={visitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(cardClassName)}
      >
        {content}
      </a>
    );
  }

  return <article className={cardClassName}>{content}</article>;
};

export default FitMarketCard;
