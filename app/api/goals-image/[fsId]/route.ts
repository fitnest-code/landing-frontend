import { NextResponse } from "next/server";
import { LANDING_KEY_HEADER } from "@/lib/api/landing-key";

export const runtime = "nodejs";
export const revalidate = 86400;

const FILE_ID = /^[A-Za-z0-9._-]{1,128}$/;
const apiBase = (
  process.env.API_BASE_URL ?? "https://api-dev.fitnest.az/api/v1"
).replace(/\/$/, "");

type RouteContext = { params: Promise<{ fsId: string }> };

function sniffImageType(bytes: Uint8Array): string | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  ) {
    return "image/webp";
  }
  const head = new TextDecoder("utf-8").decode(bytes.slice(0, 256)).trimStart();
  if (head.startsWith("<svg") || head.startsWith("<?xml") || head.includes("<svg")) {
    return "image/svg+xml";
  }
  return null;
}

export async function GET(_request: Request, context: RouteContext) {
  const { fsId } = await context.params;
  if (!FILE_ID.test(fsId)) {
    return new NextResponse(null, { status: 404 });
  }

  const headers = new Headers({ Accept: "image/*,application/octet-stream,*/*" });
  const landingKey = process.env.LANDING_API_KEY?.trim();
  if (landingKey) {
    headers.set(LANDING_KEY_HEADER, landingKey);
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `${apiBase}/public/landing/goals/images/${encodeURIComponent(fsId)}`,
      {
        headers,
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(20_000),
      },
    );
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  if (!upstream.ok) {
    return new NextResponse(null, {
      status: upstream.status === 404 ? 404 : 502,
    });
  }

  const bytes = new Uint8Array(await upstream.arrayBuffer());
  if (bytes.byteLength === 0) {
    return new NextResponse(null, { status: 404 });
  }

  const sniffed = sniffImageType(bytes);
  const upstreamType = upstream.headers.get("content-type") ?? "";
  const contentType = sniffed
    ?? (upstreamType.startsWith("image/") ? upstreamType : null);
  if (!contentType) {
    return new NextResponse(null, { status: 502 });
  }

  const headersOut = new Headers();
  headersOut.set("Content-Type", contentType);
  headersOut.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
  );
  headersOut.set("X-Content-Type-Options", "nosniff");

  return new NextResponse(bytes, {
    status: 200,
    headers: headersOut,
  });
}
