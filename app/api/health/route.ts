import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  const buildTime = process.env.BUILD_TIME ?? new Date().toISOString();

  return NextResponse.json({
    status: "ok",
    service: "my-ai-site",
    buildTime,
    timestamp: new Date().toISOString(),
  });
}
