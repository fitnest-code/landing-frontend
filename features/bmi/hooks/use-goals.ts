import { useQuery } from "@tanstack/react-query";
import { getGoals } from "../api/goals";
import type { GoalItem } from "../api/types";

export const goalsKeys = {
  all: ["goals"] as const,
  list: (locale: string) => ["goals", locale] as const,
};

export function useGoals(locale: string, initialData?: GoalItem[]) {
  return useQuery({
    queryKey: goalsKeys.list(locale),
    queryFn: () => getGoals(locale),
    initialData: initialData && initialData.length > 0 ? initialData : undefined,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
