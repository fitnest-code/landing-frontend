"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MembershipBadge, {
  MEMBERSHIP_LABELS,
  type MembershipTier,
} from "@/features/home/components/MembershipBadge";
import {
  getLandingGymV2,
  type LandingGymDetailV2,
  type LandingGymV2,
} from "@/lib/api/landing-v2";
import { addLocaleToPathname } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import FitnessGallery from "./FitnessGallery";
import GymPreviewSkeleton from "./GymPreviewSkeleton";

const TIERS: MembershipTier[] = ["bronze", "silver", "gold", "platinum"];

const toTier = (value: string | null | undefined): MembershipTier => {
  if (value === "silver" || value === "gold" || value === "platinum") {
    return value;
  }
  return "bronze";
};

const accessTiers = (gym: LandingGymDetailV2): MembershipTier[] => {
  const fromApi = (gym.accessMemberships ?? []).map(toTier);
  if (fromApi.length > 0) {
    return [...new Set(fromApi)].sort(
      (left, right) => TIERS.indexOf(left) - TIERS.indexOf(right),
    );
  }
  const min = TIERS.indexOf(toTier(gym.minEntryMembership));
  return TIERS.slice(min);
};

type FitnessCenterPreviewProps = {
  gym: LandingGymV2 | null;
};

const FitnessCenterPreview = ({ gym }: FitnessCenterPreviewProps) => {
  const { t, locale } = useI18n();
  const [detail, setDetail] = useState<LandingGymDetailV2 | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gym) {
      setDetail(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setDetail(null);
    getLandingGymV2(locale, gym.gymId)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [gym?.gymId, locale]);

  const resolved = detail;
  const name = resolved?.name ?? gym?.name ?? "";
  const categoryItems = resolved?.categoryItems ?? gym?.categoryItems ?? [];
  const categoryLabel =
    categoryItems.length > 0
      ? categoryItems.map((item) => item.name).join(" & ")
      : resolved?.category || gym?.category || "";
  const address = useMemo(() => {
    const source = resolved ?? gym;
    if (!source) return "—";
    return (
      [source.location, source.rayon, source.city].filter(Boolean).join(", ") ||
      "—"
    );
  }, [resolved, gym]);
  const hours = resolved?.workHours ?? [];
  const amenities =
    resolved?.amenities && resolved.amenities.length > 0
      ? resolved.amenities.join(" • ")
      : "";
  const description = resolved?.description?.trim() || "";
  const minTier = toTier(
    resolved?.minEntryMembership ?? gym?.minEntryMembership,
  );
  const tiers = resolved ? accessTiers(resolved) : [minTier];
  const lowestTier = MEMBERSHIP_LABELS[tiers[0] ?? minTier];
  const accessHint = (
    tiers.length > 1 ? t.centers.gymAccessHint : t.centers.gymAccessHintSingle
  ).replace("{tier}", lowestTier);
  const hasCoords =
    resolved?.latitude != null &&
    resolved?.longitude != null &&
    Number.isFinite(resolved.latitude) &&
    Number.isFinite(resolved.longitude);
  const mapSrc = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${resolved!.longitude! - 0.01}%2C${resolved!.latitude! - 0.01}%2C${resolved!.longitude! + 0.01}%2C${resolved!.latitude! + 0.01}&layer=mapnik&marker=${resolved!.latitude}%2C${resolved!.longitude}`
    : null;
  const mapsLink = hasCoords
    ? `https://www.openstreetmap.org/?mlat=${resolved!.latitude}&mlon=${resolved!.longitude}#map=16/${resolved!.latitude}/${resolved!.longitude}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(address || name)}`;

  if (!gym) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[22px] border border-[rgba(220,230,235,0.9)] bg-surface p-8 text-sm text-desc">
        {t.centers.listEmpty}
      </div>
    );
  }

  // Full-panel skeleton until detail arrives — avoids half-filled layout shift.
  // Narrow on `resolved` (alias of detail) so TS treats gallery fields as defined below.
  if (loading || !resolved) {
    return <GymPreviewSkeleton />;
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[22px] border border-[rgba(220,230,235,0.9)] bg-surface">
      <div className="relative">
        <FitnessGallery
          images={
            resolved.galleryImageUrls.length > 0
              ? resolved.galleryImageUrls
              : gym.coverImageUrl
                ? [gym.coverImageUrl]
                : []
          }
          name={name}
          previousLabel={t.centers.previousImage}
          nextLabel={t.centers.nextImage}
        />
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-col gap-0.5">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <h2 className="min-w-0 truncate text-xl font-semibold leading-[30px] text-ink">
              {name}
            </h2>
            <MembershipBadge tier={minTier} showDiscount={false} />
          </div>
          {categoryLabel ? (
            <p className="text-sm font-bold leading-5 text-turquoise">
              {categoryLabel}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-[36px] font-semibold leading-[52px] text-ink">
            {t.centers.aboutGym}
          </h3>
          {description ? (
            <p className="text-base font-medium leading-6 text-ink">
              {description}
            </p>
          ) : null}
          {amenities ? (
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-bold leading-[30px] text-ink">
                {t.centers.amenities}
              </h4>
              <p className="text-base font-medium leading-6 text-ink">
                {amenities}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-[#557C9F] pb-2 pt-5 dark:border-[#174663] sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-1">
            <img
              src="/icons/gym-details/location.svg"
              alt=""
              width={16}
              height={16}
              className="mt-0.5 size-4 shrink-0 dark:hidden"
            />
            <img
              src="/icons/gym-details/location-dark.svg"
              alt=""
              width={16}
              height={16}
              className="mt-0.5 hidden size-4 shrink-0 dark:block"
            />
            <span className="text-sm font-normal leading-5 text-turquoise">
              {t.centers.address}:
            </span>
            <span className="text-xs font-medium leading-[18px] text-desc-2">
              {address}
            </span>
          </div>
          <div className="flex shrink-0 items-start gap-1">
            <img
              src="/icons/gym-details/clock.svg"
              alt=""
              width={14}
              height={14}
              className="mt-0.5 size-3.5 shrink-0 dark:hidden"
            />
            <img
              src="/icons/gym-details/clock-dark.svg"
              alt=""
              width={14}
              height={14}
              className="mt-0.5 hidden size-3.5 shrink-0 dark:block"
            />
            <span className="w-[70px] text-center text-sm font-normal leading-5 text-turquoise">
              {t.centers.workHoursTitle}:
            </span>
            <div className="flex flex-col gap-1">
              {hours.length > 0 ? (
                hours.map((line) => (
                  <span
                    key={line}
                    className="text-xs font-medium leading-[18px] text-desc-2"
                  >
                    {line}
                  </span>
                ))
              ) : (
                <span className="text-xs font-medium leading-[18px] text-desc-2">
                  —
                </span>
              )}
            </div>
          </div>
        </div>

        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-2xl"
        >
          {mapSrc ? (
            <iframe
              title={t.centers.map}
              src={mapSrc}
              className="h-[220px] w-full border-0 md:h-[291px]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <img
              src="/images/gym-details/map.png"
              alt={t.centers.map}
              className="h-[220px] w-full object-cover md:h-[291px]"
            />
          )}
        </a>

        <div className="flex flex-col gap-3 rounded-2xl bg-brand-navy-800 p-3 dark:bg-brand-navy-200">
          <p className="text-base font-bold leading-6 text-cyan dark:text-[#00DBDB]">
            {t.centers.gymAccess}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {tiers.map((tier, index) => (
              <span key={tier} className="flex items-center gap-6">
                {index > 0 ? (
                  <span className="size-1 rounded-full bg-white dark:bg-brand-navy" />
                ) : null}
                <MembershipBadge
                  tier={tier}
                  variant="gradient"
                  showDiscount={false}
                />
              </span>
            ))}
          </div>
          <p className="text-sm font-normal leading-5 text-desc dark:text-title">
            {accessHint}
          </p>
          <Link
            href={addLocaleToPathname(`/fitness-centers/${gym.gymId}`, locale)}
            className="mt-1 inline-flex w-fit text-sm font-semibold text-cyan hover:underline"
          >
            {t.centers.openDetails}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FitnessCenterPreview;
