export interface BmiCalculateRequest {
  height: number;
  weight: number;
  birthDate: string;
  gender: string;
}

export interface BmiCalculateResponse {
  bmi: number;
  category: string;
}

export interface GoalItem {
  code: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
}
