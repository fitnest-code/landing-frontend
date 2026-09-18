"use client";

import { useI18n } from "@/lib/i18n/provider";
import RemoteImage from "@/components/common/RemoteImage";
import { storeImageSrc, type LandingStore } from "@/lib/api/landing";
import DiscountBadges from "./DiscountBadges";

type FitMarketCardProps = {
  store: LandingStore;
};

const FitMarketCard = ({ store }: FitMarketCardProps) => {
  const { t } = useI18n();
  const address = [store.city, store.addressText].filter(Boolean).join(", ");
  const description = store.category || t.fitMarket.detailsDescription;
  const workHours = store.workHoursText
    ? `${t.fitMarket.workHours}: ${store.workHoursText}`
    : null;
  const visitUrl = store.socialUrl?.trim() || null;

  return (
    <article className="group flex h-full min-w-0 flex-col justify-between gap-6 rounded-[32px] border border-border-muted bg-surface p-5">
      <div className="flex flex-col gap-6">
        <div className="relative h-[250px] overflow-hidden rounded-3xl">
          <RemoteImage
            src={storeImageSrc(store.coverImageUrl)}
            fallback="/images/first.png"
            alt={store.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 410px"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[168px] rounded-b-3xl bg-[linear-gradient(180deg,rgba(24,23,26,0)_0%,black_100%)]" />
          {visitUrl ? (
            <a
              href={visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-3 z-10 inline-flex h-9 items-center rounded-lg bg-button px-3 text-sm font-semibold text-white hover:bg-[#FF6A42]"
            >
              {t.fitMarket.visitShort}
            </a>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-xl font-semibold leading-[30px] text-turquoise">
              {store.name}
            </h3>
            <DiscountBadges discounts={store.discounts ?? []} />
          </div>
          <p className="line-clamp-2 min-h-[36px] text-xs font-medium leading-[18px] text-ink">
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
    </article>
  );
};

export default FitMarketCard;
