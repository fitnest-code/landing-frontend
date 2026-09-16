import { useQuery } from "@tanstack/react-query";
import { getGoals } from "../api/goals";
import type { GoalItem } from "../api/types";

export const goalsKeys = {
  all: ["goals"] as const,
  list: (locale: string) => ["goals", locale] as const,
};

type UseGoalsOptions = {
  initialGoals?: GoalItem[];
  initialLocale?: string;
};

export function useGoals(locale: string, options: UseGoalsOptions = {}) {
  const seeded =
    Boolean(options.initialGoals?.length) && options.initialLocale === locale;

  return useQuery({
    queryKey: goalsKeys.list(locale),
    queryFn: () => getGoals(locale),
    initialData: seeded ? options.initialGoals : undefined,
    staleTime: 30 * 1000,
    refetchOnMount: "always",
    retry: 1,
  });
}
