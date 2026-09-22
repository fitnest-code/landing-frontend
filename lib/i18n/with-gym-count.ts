/** Fallback when landing stats are unavailable; matches current catalog total. */
export const DEFAULT_GYM_COUNT = 163;

export function resolveGymCount(count: number | null | undefined): number {
  return count != null && count > 0 ? count : DEFAULT_GYM_COUNT;
}

export function withGymCount(
  template: string,
  count: number | null | undefined,
): string {
  return template.replaceAll("{n}", String(resolveGymCount(count)));
}
