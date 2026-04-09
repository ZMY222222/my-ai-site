import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "my-ai-site",
    timestamp: new Date().toISOString(),
  });
}
