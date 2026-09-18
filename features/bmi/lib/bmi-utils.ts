export type Gender = "male" | "female";

export const BMI_MIN = 15;
export const BMI_MAX = 40;

export const normalizeDecimalInput = (value: string) =>
  value.replace(/[^\d.,]/g, "").replace(",", ".");

export const normalizeAgeInput = (value: string) =>
  value.replace(/\D/g, "").slice(0, 3);

export const PHONE_COUNTRY_CODE = "994";
export const PHONE_PREFIX = `+${PHONE_COUNTRY_CODE}`;

export const normalizePhoneInput = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith(PHONE_COUNTRY_CODE)
    ? digits.slice(PHONE_COUNTRY_CODE.length)
    : digits;
  return local.slice(0, 9);
};

const AZ_MOBILE = /^(10|50|51|55|60|70|77|99)\d{7}$/;

export const isValidPhone = (value: string) =>
  AZ_MOBILE.test(normalizePhoneInput(value));

export const formatFullPhone = (value: string) =>
  `${PHONE_PREFIX}${normalizePhoneInput(value)}`;

export const isValidOptionalEmail = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};

export const birthDateFromAge = (age: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const getBmiMeta = (bmi: number) => {
  if (bmi < 18.5) {
    return {
      key: "underweight" as const,
      chipClass: "bg-[#2B7FFF]",
    };
  }

  if (bmi <= 24.9) {
    return {
      key: "normal" as const,
      chipClass: "bg-[#0B7B10] dark:bg-[#35C83D]",
    };
  }

  if (bmi <= 29.9) {
    return {
      key: "overweight" as const,
      chipClass: "bg-[#F59E0B]",
    };
  }

  return {
    key: "obesity" as const,
    chipClass: "bg-[#EF4444]",
  };
};
