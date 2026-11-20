import type { ReactNode } from "react";

/** Minimal chrome for shareable link-in-bio pages (no navbar/footer). */
export default function LinksLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
