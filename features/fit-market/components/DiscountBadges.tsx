import MembershipBadge, {
  MEMBERSHIP_DISCOUNTS,
  MEMBERSHIP_LABELS,
  type MembershipTier,
} from "@/features/home/components/MembershipBadge";

const parsePercent = (value: string) => {
  const match = value.match(/\d+/);
  return match ? match[0] : "";
};

export const detectStoreMembershipTier = (
  value: string,
  index = 0,
): MembershipTier => {
  const lower = value.toLowerCase();
  if (lower.includes("platinum")) return "platinum";
  if (lower.includes("gold")) return "gold";
  if (lower.includes("silver")) return "silver";
  if (lower.includes("bronze")) return "bronze";

  const percent = Number(parsePercent(value));
  if (!Number.isNaN(percent) && percent > 0) {
    if (percent >= 15) return "platinum";
    if (percent >= 10) return "gold";
    if (percent >= 5) return "silver";
    return "bronze";
  }

  const fallback: MembershipTier[] = ["gold", "silver", "platinum", "bronze"];
  return fallback[index % fallback.length];
};

export const storeDiscountLabel = (value: string, index = 0) => {
  const tier = detectStoreMembershipTier(value, index);
  const parsed = parsePercent(value);
  const percent = parsed ? `${parsed} %` : MEMBERSHIP_DISCOUNTS[tier];
  return `${MEMBERSHIP_LABELS[tier]} ${percent}`;
};

const primaryDiscount = (discounts: string[]) =>
  discounts.reduce((best, current) => {
    const bestPercent = Number(parsePercent(best) || 0);
    const currentPercent = Number(parsePercent(current) || 0);
    return currentPercent > bestPercent ? current : best;
  });

type DiscountBadgesProps = {
  discounts: string[];
};

const DiscountBadges = ({ discounts }: DiscountBadgesProps) => {
  if (!discounts || discounts.length === 0) return null;

  const discount = primaryDiscount(discounts);
  const tier = detectStoreMembershipTier(discount);
  const parsed = parsePercent(discount);

  return (
    <MembershipBadge
      tier={tier}
      showDiscount
      discountLabel={parsed ? `${parsed} %` : MEMBERSHIP_DISCOUNTS[tier]}
    />
  );
};

export default DiscountBadges;
