type EpicTrackEntry = {
    _title?: string;
    track?: {
      tt?: string; // title
      an?: string; // artist name
      mt?: number; // tempo/bpm
      mk?: string; // musical key
      au?: string; // cover image url
    };
  };
  
  type EpicResponse = {
    [slug: string]: EpicTrackEntry;
  };

  
  export async function fetchEpicTracks() {
    const res = await fetch(
      "https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/spark-tracks",
      {
        cache: "no-store",
      }
    );
  
    if (!res.ok) {
      throw new Error(`Epic API error: ${res.status} ${res.statusText}`);
    }
  
    const data: EpicResponse = await res.json();
  
    const tracks = Object.entries(data)
      .map(([slug, entry]) => {
        const t = entry?.track;
        if (!t?.tt || !t?.an) return null;
  
        return {
          id: slug,
          title: t.tt.trim(),
          artist: t.an.trim(),
          bpm: typeof t.mt === "number" ? t.mt : null,
          key: t.mk ?? null,
          coverUrl: t.au ?? null,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      title: string;
      artist: string;
      bpm: number | null;
      key: string | null;
      coverUrl: string | null;
    }>;
  
    return tracks;
  }