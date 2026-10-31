import { apiClient } from "@/lib/api";
import type { BmiCalculateRequest, BmiCalculateResponse } from "./types";

const ENDPOINT = "/bmi/calculate";

function normalizeBmiResponse(payload: unknown): BmiCalculateResponse {
  const wrapped = payload && typeof payload === "object" ? payload : {};
  // Handle both shapes: {bmi, category} and {data: {bmi, category}}
  const data = "data" in wrapped ? (wrapped as { data?: unknown }).data : wrapped;
  if (!data || typeof (data as { bmi?: unknown }).bmi !== "number") {
    throw new Error("Invalid BMI response");
  }
  return {
    bmi: (data as { bmi: number }).bmi,
    category: String((data as { category?: unknown }).category ?? ""),
  };
}

export async function calculateBmi(
  body: BmiCalculateRequest,
): Promise<BmiCalculateResponse> {
  const { data } = await apiClient.post<BmiCalculateResponse>(ENDPOINT, body);
  return normalizeBmiResponse(data);
}
