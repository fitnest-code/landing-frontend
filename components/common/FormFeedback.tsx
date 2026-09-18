import type { ReactNode } from "react";
import { CONTACT_PHONE } from "@/lib/constants/app-links";

export function withPhone(template: string, phone = CONTACT_PHONE): ReactNode {
  const parts = template.split("{phone}");
  if (parts.length === 1) return template;
  return (
    <>
      {parts[0]}
      <span className="font-semibold">{phone}</span>
      {parts.slice(1).join("{phone}")}
    </>
  );
}

export const FormSuccess = ({
  title,
  body,
}: {
  title: string;
  body: ReactNode;
}) => (
  <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-border-muted bg-surface px-6 py-16 text-center md:min-h-[360px] md:px-10">
    <div className="flex max-w-full flex-wrap items-center justify-center gap-3">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-cyan text-cyan"
        aria-hidden
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6L9 17l-5-5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <h2 className="text-[22px] font-semibold leading-8 text-ink md:text-[28px] md:leading-10">
        {title}
      </h2>
    </div>
    <p className="max-w-[560px] text-base leading-6 text-title">{body}</p>
  </div>
);

export const FormError = ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => (
  <div
    role="alert"
    className="flex items-start gap-3 rounded-xl border border-[#F4A89A] bg-[#FDECEA] px-4 py-3 text-left dark:border-[#E07A6A] dark:bg-[#3A1C18]"
  >
    <span
      className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-[#E24B2D]"
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    <div className="flex flex-col gap-0.5">
      <p className="text-sm font-semibold leading-5 text-ink">{title}</p>
      <p className="text-sm leading-5 text-title">{body}</p>
    </div>
  </div>
);
