import { db } from "@/lib/db";
import { todayUTC } from "@/lib/date";
import { fetchEpicTracks } from "@/lib/fetchEpicTracks";
import { fetchDailyFromFortniteGG } from "@/lib/fetchDailyTracks";

export const runtime = "nodejs";

function isVercelCron(req: Request) {
  return req.headers.get("x-vercel-cron") === "1";
}

function normalizeTitle(s: string) {
  return s.trim().toLowerCase();
}

export async function GET(req: Request) {
  if (!isVercelCron(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ===== 1) SYNC CATÁLOGO (Epic spark-tracks) =====
  const epicTracks = await fetchEpicTracks();

  let catalogUpserted = 0;
  for (const t of epicTracks) {
    await db.track.upsert({
      where: { id: t.id },
      update: {
        title: t.title,
        artist: t.artist,
        bpm: t.bpm ?? undefined,
        key: t.key ?? undefined,
        coverUrl: t.coverUrl ?? undefined,
      },
      create: {
        id: t.id,
        title: t.title,
        artist: t.artist,
        bpm: t.bpm ?? undefined,
        key: t.key ?? undefined,
        coverUrl: t.coverUrl ?? undefined,
      },
    });
    catalogUpserted++;
  }

  // ===== 2) SYNC DAILY (Fortnite.gg) =====
  const date = todayUTC();
  const dailyItems = await fetchDailyFromFortniteGG();

  await db.dailyRotation.deleteMany({ where: { date } });

  let dailyInserted = 0;
  let dailyMissing = 0;

  for (const it of dailyItems) {
    if (!it.title) {
      dailyMissing++;
      continue;
    }

    const wanted = normalizeTitle(it.title);

    const track = await db.track.findFirst({
      where: {
        title: { equals: wanted, mode: "insensitive" },
      },
      select: { id: true },
    });

    if (!track) {
      dailyMissing++;
      continue;
    }

    await db.dailyRotation.create({
      data: { date, trackId: track.id },
    });

    dailyInserted++;
  }

  return Response.json({
    message: "Cron OK (catalog + daily)",
    date,
    catalog: { fetched: epicTracks.length, upserted: catalogUpserted },
    daily: { foundOnGG: dailyItems.length, inserted: dailyInserted, missingInCatalog: dailyMissing },
  });
}