export function monthlyPrice(total: number, durationMonths: number): number {
  if (!Number.isFinite(total)) return 0;
  if (!durationMonths || durationMonths <= 0) return Math.round(total);
  return Math.round(total / durationMonths);
}

export function formatManat(value: number): string {
  return String(Math.round(value));
}
