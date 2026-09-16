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

export type DisplayGoal = {
  id: string;
  title: string;
  description: string;
  imageSrc: string | null;
  iconName: string;
};

export function resolveGoalImageUrl(imageUrl: string | null | undefined): string | null {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return null;

  let pathname = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      pathname = new URL(trimmed).pathname;
    } catch {
      return null;
    }
  }

  const match = pathname.match(/\/(?:api\/v1\/)?goals\/images\/([^/?]+)/);
  if (match?.[1]) {
    return `/api/proxy/goals/images/${match[1]}`;
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
  };
}
