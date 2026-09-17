import { apiClient, localeHeaders, serverApiClient } from "@/lib/api";
import type { GoalItem } from "./types";

const ENDPOINT = "/public/landing/goals";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function pickString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function toGoalItem(value: unknown): GoalItem | null {
  const item = asRecord(value);
  if (!item || typeof item.code !== "string" || typeof item.title !== "string") {
    return null;
  }
  return {
    code: item.code,
    title: item.title,
    subtitle: pickString(item.subtitle),
    imageUrl: pickString(
      item.imageUrl,
      item.image_url,
      item.iconUrl,
      item.icon_url,
    ),
  };
}

export function normalizeGoals(payload: unknown): GoalItem[] {
  const wrapped = asRecord(payload);
  const source = Array.isArray(payload)
    ? payload
    : (wrapped?.data ?? wrapped?.items);

  if (!Array.isArray(source)) return [];
  return source.map(toGoalItem).filter((item): item is GoalItem => item !== null);
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
