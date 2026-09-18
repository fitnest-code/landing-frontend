import { apiClient } from "@/lib/api";

export type BmiLeadPayload = {
  phone: string;
  email?: string;
  goalCode: string;
  goalTitle: string;
  heightCm: number;
  weightKg: number;
  age?: number;
  gender?: string;
  consent: true;
};

export async function submitBmiLead(input: BmiLeadPayload): Promise<boolean> {
  try {
    await apiClient.post("/public/landing/bmi-requests", {
      phone: input.phone,
      email: input.email?.trim() || undefined,
      goalCode: input.goalCode,
      goalTitle: input.goalTitle,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      age: input.age,
      gender: input.gender,
      consent: true,
    });
    return true;
  } catch {
    return false;
  }
}
