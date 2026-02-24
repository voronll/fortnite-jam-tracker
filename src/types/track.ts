export type Track = {
  id: string;
  title: string;
  artist: string;
  bpm?: number | null;
  key?: string | null;
  coverUrl?: string | null;
};
