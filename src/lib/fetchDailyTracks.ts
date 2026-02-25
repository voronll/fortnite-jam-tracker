import * as cheerio from "cheerio";

export type DailyGGItem = {
  cosmeticId: string;
  sid: string | null;
  title: string | null;
  artist: string | null;
};

const HEADERS: Record<string, string> = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
  accept: "text/html,*/*",
  "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  referer: "https://fortnite.gg/",
};

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

async function fetchText(url: string) {
  const res = await fetch(url, { cache: "no-store", headers: HEADERS });
  if (!res.ok) throw new Error(`Fetch error ${res.status} on ${url}`);
  return res.text();
}

function extractSID(html: string): string | null {
  const m1 = html.match(/ID:\s*(SID_[A-Za-z0-9_]+)/);
  if (m1?.[1]) return m1[1];

  const m2 = html.match(/(SID_[A-Za-z0-9_]+)/);
  return m2?.[1] ?? null;
}

function extractTitleAndArtist(html: string): { title: string | null; artist: string | null } {
  const $ = cheerio.load(html);

  const h1 = $("h1").first().text().trim();
  const pageTitle = $("title").text().trim();

  const raw = h1 || pageTitle;
  if (!raw) return { title: null, artist: null };

  let title: string | null = null;
  let artist: string | null = null;

  if (raw.includes(" - ")) {
    const [left, ...rest] = raw.split(" - ");
    title = left.trim() || null;
    artist = rest.join(" - ").trim() || null;
  } else {
    title = raw.trim() || null;
  }

  if (title) {
    title = title.replace(/\s*\|\s*Fortnite\.GG.*$/i, "").trim();
    title = title.replace(/\s*-\s*Fortnite\.GG.*$/i, "").trim();
  }

  if (artist) {
    artist = artist.replace(/\s*\|\s*Fortnite\.GG.*$/i, "").trim();
    artist = artist.replace(/\s*-\s*Fortnite\.GG.*$/i, "").trim();
  }

  return { title, artist };
}

function extractCosmeticIdsFromHtml(html: string): string[] {
  const ids: string[] = [];

  try {
    const $ = cheerio.load(html);
    const domIds = $("a.jam")
      .map((_, el) => {
        const href = $(el).attr("href") ?? "";
        const m = href.match(/cosmetics\?id=(\d+)/);
        return m?.[1] ?? null;
      })
      .get()
      .filter(Boolean) as string[];
    ids.push(...domIds);
  } catch { 
  }

  const anywhereCosmetics = /cosmetics\?id=(\d+)/g;
  for (const m of html.matchAll(anywhereCosmetics)) ids.push(m[1]);

  const modalRe = /modal\(\s*(\d+)[\s\S]*?["']item["'][\s\S]*?\)/g;
  for (const m of html.matchAll(modalRe)) ids.push(m[1]);

  return uniq(ids);
}

export async function fetchDailyFromFortniteGG(): Promise<DailyGGItem[]> {
  const dailyHtml = await fetchText("https://fortnite.gg/daily-jam-tracks");
  const cosmeticIds = extractCosmeticIdsFromHtml(dailyHtml);

  const out: DailyGGItem[] = [];

  for (const cosmeticId of cosmeticIds) {
    const itemHtml = await fetchText(`https://fortnite.gg/cosmetics?id=${cosmeticId}`);

    const sid = extractSID(itemHtml);
    const { title, artist } = extractTitleAndArtist(itemHtml);

    out.push({ cosmeticId, sid, title, artist });
  }

  return out;
}