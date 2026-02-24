import { db } from "@/lib/db";
import { todayUTC } from "@/lib/date";
import { fetchDailyFromFortniteGG } from "@/lib/fetchDailyTracks";

export const runtime = "nodejs";

function normalizeTitle(s: string) {
  return s.trim().toLowerCase();
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const token = url.searchParams.get("token");
  if (process.env.SYNC_TOKEN && token !== process.env.SYNC_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const date = todayUTC();
  const items = await fetchDailyFromFortniteGG();

  if (url.searchParams.get("debug") === "1") {
    return Response.json({
      message: "Debug daily scrape",
      date,
      foundOnGG: items.length,
      sample: items.slice(0, 5),
    });
  }

  await db.dailyRotation.deleteMany({ where: { date } });

  let inserted = 0;
  let missingInCatalog = 0;

  for (const it of items) {
    if (!it.title) {
      missingInCatalog++;
      continue;
    }

    const wanted = normalizeTitle(it.title);

    // SQLite não suporta mode: "insensitive"; usamos LOWER(TRIM(title)) na raw query
    const rows = await db.$queryRaw<{ id: string }[]>`
      SELECT id FROM Track WHERE LOWER(TRIM(title)) = ${wanted} LIMIT 1
    `;
    const track = rows[0] ?? null;

    if (!track) {
      missingInCatalog++;
      continue;
    }

    await db.dailyRotation.create({
      data: { date, trackId: track.id }, // track.id = slug
    });

    inserted++;
  }

  return Response.json({
    message: "Daily sync concluído (Fortnite.gg)",
    date,
    foundOnGG: items.length,
    inserted,
    missingInCatalog,
  });
}