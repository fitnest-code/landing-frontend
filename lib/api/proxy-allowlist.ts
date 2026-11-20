export function isAllowedProxyPath(segments: string[]): boolean {
  if (segments.length === 0) return false;
  if (segments.some((part) => !part || part === ".." || part.includes("\\") || part.includes("\0"))) {
    return false;
  }

  const joined = segments.join("/");
  // Landing v2 public catalog (api/v2/public/landing/...)
  if (joined.startsWith("v2/public/landing/")) return true;
  if (joined.startsWith("public/landing/")) return true;
  if (joined === "subscription-packages" || joined.startsWith("subscription-packages/")) {
    return true;
  }
  if (joined === "bmi/calculate" || joined.startsWith("bmi/calculate/")) return true;
  return false;
}

export function proxyRateLimitKey(method: string, joinedPath: string): { key: string; limit: number } | null {
  const path = joinedPath.toLowerCase();
  // Proxy injects the landing key — keep a per-IP cap so random curls at the site edge stay limited.
  // Gateway still skips RL only when the real landing key is present (SSR / our BFF).
  if (method === "GET" && path.startsWith("v2/public/landing/")) {
    return { key: "landing-v2-read", limit: 120 };
  }
  if (method === "POST" && path.startsWith("public/landing/contact-messages")) {
    return { key: "contact", limit: 8 };
  }
  if (method === "POST" && path.startsWith("public/landing/bmi-requests")) {
    return { key: "bmi-lead", limit: 5 };
  }
  if (method === "POST" && path.startsWith("public/landing/partner-applications")) {
    return { key: "partner-lead", limit: 5 };
  }
  if (method === "POST" && path.startsWith("bmi/calculate")) {
    return { key: "bmi", limit: 20 };
  }
  if (method === "GET" && path.startsWith("public/landing/")) {
    return { key: "landing-read", limit: 120 };
  }
  return { key: "other", limit: 60 };
}

/** Build upstream URL: v1 stays on apiBase; v2 rewrites to /api/v2/... */
export function resolveProxyUpstream(
  apiBase: string,
  joinedPath: string,
  search: string,
): string {
  if (joinedPath.startsWith("v2/")) {
    const origin = apiBase.replace(/\/api\/v1\/?$/, "");
    return `${origin}/api/${joinedPath}${search}`;
  }
  return `${apiBase}/${joinedPath}${search}`;
}
