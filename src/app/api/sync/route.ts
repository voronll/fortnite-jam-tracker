import { db } from "@/lib/db";
import { fetchEpicTracks } from "@/lib/fetchEpicTracks";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (process.env.SYNC_TOKEN && token !== process.env.SYNC_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tracks = await fetchEpicTracks();

  let upserted = 0;

  for (const t of tracks) {
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

    upserted++;
  }

  return Response.json({
    message: "Sync concluído",
    fetched: tracks.length,
    upserted,
  });
}