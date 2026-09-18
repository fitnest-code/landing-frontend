"use client";

import Link from "next/link";
import MembershipBadge, {
  type MembershipTier,
} from "@/features/home/components/MembershipBadge";
import RemoteImage from "@/components/common/RemoteImage";
import { gymImageSrc, type LandingCategoryItem } from "@/lib/api/landing";

export type FitnessCenterCardProps = {
  name: string;
  location: string;
  image: string;
  category: string;
  categoryItems?: LandingCategoryItem[];
  membership: MembershipTier;
  href: string;
};

const FitnessCenterCard = ({
  name,
  location,
  image,
  category,
  categoryItems = [],
  membership,
  href,
}: FitnessCenterCardProps) => {
  return (
    <Link
      href={href}
      className="group flex h-full min-w-0 flex-col justify-between gap-6 rounded-[32px] border border-border-muted bg-surface p-4 transition-colors duration-200 hover:border-cyan hover:bg-page hover:shadow-[0px_24px_50px_rgba(0,157,166,0.16)] sm:p-5"
    >
      <div className="flex flex-col gap-6">
        <div className="relative h-[200px] overflow-hidden rounded-2xl sm:h-[250px]">
          <RemoteImage
            src={gymImageSrc(image)}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 411px"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <h3 className="min-w-0 truncate text-lg font-semibold leading-7 text-turquoise transition-colors group-hover:text-ink sm:text-xl sm:leading-[30px]">
              {name}
            </h3>
            <MembershipBadge tier={membership} showDiscount={false} />
          </div>
          <p className="min-h-[20px] text-sm font-bold leading-5 text-turquoise">
            {categoryItems.length > 0 ? (
              <span className="flex flex-wrap items-center gap-2">
                {categoryItems.map((item) => (
                  <span key={item.name} className="inline-flex items-center gap-1.5">
                    {item.iconUrl ? (
                      <img src={item.iconUrl} alt="" className="size-5 object-contain" />
                    ) : null}
                    {item.name}
                  </span>
                ))}
              </span>
            ) : (
              category || "\u00A0"
            )}
          </p>
        </div>
      </div>
      <div className="mt-auto pt-2 text-sm font-medium leading-5 text-desc-2">
        <span className="inline-flex min-w-0 items-center gap-2">
          <img
            src="/icons/gyms/map-pin.svg"
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
          <span className="line-clamp-1">{location}</span>
        </span>
      </div>
    </Link>
  );
};

export default FitnessCenterCard;
