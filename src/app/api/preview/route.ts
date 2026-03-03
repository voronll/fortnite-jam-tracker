import { NextResponse } from "next/server";

const DEEZER_SEARCH = "https://api.deezer.com/search";

type DeezerTrack = {
  id: number;
  title: string;
  preview?: string;
  // outros campos ignorados
};

type DeezerSearchResponse = {
  data?: DeezerTrack[];
  error?: { message: string };
};

/**
 * GET /api/preview?title=...&artist=...
 * Busca na Deezer e retorna a URL do preview (~30s) da primeira faixa encontrada.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "").trim();
  const artist = (searchParams.get("artist") ?? "").trim();

  if (!title && !artist) {
    return NextResponse.json(
      { error: "title ou artist é obrigatório" },
      { status: 400 }
    );
  }

  const query = [artist, title].filter(Boolean).join(" ");
  const url = `${DEEZER_SEARCH}?q=${encodeURIComponent(query)}&limit=5`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json(
        { previewUrl: null, error: `Deezer API: ${res.status}` },
        { status: 200 }
      );
    }

    const body = (await res.json()) as DeezerSearchResponse;
    if (body.error) {
      return NextResponse.json(
        { previewUrl: null, error: body.error.message },
        { status: 200 }
      );
    }

    const tracks = body.data ?? [];
    const withPreview = tracks.find((t) => t.preview);
    const previewUrl = withPreview?.preview ?? null;

    return NextResponse.json({
      previewUrl,
      trackId: withPreview?.id ?? null,
      title: withPreview?.title ?? null,
    });
  } catch (e) {
    console.error("[preview] Deezer request failed:", e);
    return NextResponse.json(
      { previewUrl: null, error: "Erro ao buscar preview" },
      { status: 200 }
    );
  }
}
