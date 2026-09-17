import type { GoalItem } from "../api/types";

const GOAL_ICONS: Record<string, string> = {
  muscle: "goal-muscle",
  "gain-muscle": "goal-muscle",
  "build-muscle": "goal-muscle",
  endurance: "goal-endurance",
  "improve-endurance": "goal-endurance",
  lifestyle: "goal-lifestyle",
  "healthy-lifestyle": "goal-lifestyle",
  shape: "goal-shape",
  "stay-in-shape": "goal-shape",
  "keep-fit": "goal-shape",
  "weight-loss": "weight",
  "lose-weight": "weight",
};

const GOALS_IMAGE_PATH =
  /\/(?:api\/v1\/)?(?:public\/landing\/)?goals\/images\/([^/?#]+)/i;
const MEDIA_IMAGE_PATH =
  /\/(?:api\/(?:v1\/)?(?:public\/landing\/)?media(?:\/stream)?|media\/stream)\/([1-9][0-9]{0,18})(?:[/?#].*)?$/i;
const RAW_FILE_ID = /^[A-Za-z0-9._-]{1,128}$/;

export type DisplayGoal = {
  id: string;
  title: string;
  description: string;
  imageSrc: string | null;
  iconName: string;
  fromApi: boolean;
};

function pathnameFrom(url: string): string {
  if (!/^https?:\/\//i.test(url)) return url;
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

export function resolveGoalImageUrl(
  imageUrl: string | null | undefined,
): string | null {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("/icons/") ||
    trimmed.startsWith("/images/") ||
    trimmed.startsWith("/api/goals-image/") ||
    trimmed.startsWith("/api/media/")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/api/proxy/public/landing/goals/images/")) {
    const id = trimmed.slice("/api/proxy/public/landing/goals/images/".length);
    return id ? `/api/goals-image/${id}` : null;
  }

  const pathname = pathnameFrom(trimmed);
  const goalsMatch = pathname.match(GOALS_IMAGE_PATH);
  if (goalsMatch?.[1]) {
    return `/api/goals-image/${encodeURIComponent(goalsMatch[1])}`;
  }

  const mediaMatch = pathname.match(MEDIA_IMAGE_PATH);
  if (mediaMatch?.[1]) {
    return `/api/media/${mediaMatch[1]}`;
  }

  if (RAW_FILE_ID.test(trimmed)) {
    return `/api/goals-image/${encodeURIComponent(trimmed)}`;
  }

  return null;
}

export function goalIconName(code: string): string {
  const key = code.toLowerCase().replace(/_/g, "-");
  if (GOAL_ICONS[key]) return GOAL_ICONS[key];
  if (key.includes("muscle") || key.includes("mass")) return "goal-muscle";
  if (key.includes("endur") || key.includes("stamina") || key.includes("cardio")) {
    return "goal-endurance";
  }
  if (key.includes("life") || key.includes("health")) return "goal-lifestyle";
  if (key.includes("shape") || key.includes("maintain") || key.includes("keep")) {
    return "goal-shape";
  }
  if (key.includes("weight") || key.includes("lose") || key.includes("fat")) {
    return "weight";
  }
  return "weight";
}

export function mapApiGoal(goal: GoalItem): DisplayGoal {
  return {
    id: goal.code,
    title: goal.title,
    description: goal.subtitle ?? "",
    imageSrc: resolveGoalImageUrl(goal.imageUrl),
    iconName: goalIconName(goal.code),
    fromApi: true,
  };
}
