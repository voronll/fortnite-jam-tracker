import { db } from "@/lib/db";
import { todayUTC } from "@/lib/date";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = (searchParams.get("date") ?? todayUTC()).trim();

  const rows = await db.dailyRotation.findMany({
    where: { date },
    include: { track: true },
  });

  return Response.json(rows.map((r) => r.track));
}