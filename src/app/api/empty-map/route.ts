import { NextResponse } from "next/server";

/**
 * Clean 200 OK fallback handler for third-party library sourcemap requests.
 * Eliminates 404 noise in terminal logs for packages missing source map files.
 *
 * @returns Empty JSON sourcemap response.
 */
export async function GET() {
  return new NextResponse("{}", {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
