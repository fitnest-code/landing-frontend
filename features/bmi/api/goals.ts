import { apiClient, localeHeaders, serverApiClient } from "@/lib/api";
import type { GoalItem } from "./types";

const ENDPOINT = "/public/landing/goals";

function isGoalItem(value: unknown): value is GoalItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.code === "string" && typeof item.title === "string";
}

export function normalizeGoals(payload: unknown): GoalItem[] {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object"
      ? ((payload as { data?: unknown; items?: unknown }).data ??
        (payload as { items?: unknown }).items)
      : null;

  if (!Array.isArray(source)) return [];
  return source.filter(isGoalItem).map((item) => ({
    code: item.code,
    title: item.title,
    subtitle: item.subtitle ?? null,
    imageUrl: item.imageUrl ?? null,
  }));
}

function languageParams(locale?: string) {
  const language = locale?.trim().slice(0, 2).toUpperCase();
  return language ? { language } : undefined;
}

export async function getGoals(locale?: string): Promise<GoalItem[]> {
  const { data } = await apiClient.get<unknown>(ENDPOINT, {
    headers: localeHeaders(locale),
    params: languageParams(locale),
  });
  return normalizeGoals(data);
}

export async function getGoalsServer(locale?: string): Promise<GoalItem[]> {
  try {
    const { data } = await serverApiClient.get<unknown>(ENDPOINT, {
      headers: localeHeaders(locale),
      params: languageParams(locale),
    });
    return normalizeGoals(data);
  } catch {
    return [];
  }
}
