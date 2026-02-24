import { db } from "@/lib/db";

export async function GET() {
  const sample = await db.track.findMany({
    select: { id: true },
    take: 20,
    orderBy: { id: "asc" },
  });

  const sidCount = await db.track.count({
    where: { id: { startsWith: "SID_" } },
  });

  const total = await db.track.count();

  return Response.json({
    total,
    sidCount,
    sample: sample.map((s) => s.id),
  });
}