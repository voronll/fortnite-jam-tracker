import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") ?? "").trim();
  const takeRaw = Number(searchParams.get("take") ?? "20");
  const take = Number.isFinite(takeRaw) ? Math.min(Math.max(takeRaw, 1), 50) : 20;

  if (!q) {
    // Se quiser, pode retornar "top recentes" ou vazio. Vou retornar vazio pra não poluir.
    return Response.json([]);
  }

  // Busca simples e eficaz (SQLite não tem ILIKE; contains costuma ser case-insensitive no SQLite)
  const tracks = await db.track.findMany({
    where: {
      OR: [{ title: { contains: q } }, { artist: { contains: q } }],
    },
    orderBy: [{ title: "asc" }],
    take,
  });

  return Response.json(tracks);
}