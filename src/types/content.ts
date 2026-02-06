export interface Album {
  id: string;
  slug: string;
  title: string;
  year: number;
  themeId: string;
  spotifyId?: string;
  appleMusicId?: string;
  coverUrl: string;
  description: string;
  descriptionEn: string;
  trackCount: number;
  tracks: Track[];
}

export interface Track {
  id: string;
  title: string;
  trackNumber: number;
  durationMs: number;
  spotifyId?: string;
  featuring?: string;
  albumId: string;
  audioFeatures?: AudioFeatures;
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
}

export type AwardCeremony =
  | "GRAMMY"
  | "LATIN_GRAMMY"
  | "BILLBOARD"
  | "MTV"
  | "AMERICAN_MUSIC"
  | "OTHER";

export type AwardResult = "WON" | "NOMINATED";

export interface Award {
  id: string;
  title: string;
  ceremony: AwardCeremony;
  category: string;
  year: number;
  result: AwardResult;
}

export type TimelineEventType =
  | "RELEASE"
  | "AWARD"
  | "CONCERT"
  | "COLLABORATION"
  | "MILESTONE";

export interface TimelineEvent {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  era: string;
  type: TimelineEventType;
  importance: number;
  imageUrl?: string;
}

export interface Interview {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  outlet: string;
  date: string;
  youtubeId: string;
  description: string;
  descriptionEn: string;
  tags: string[];
  language: string;
}

export interface Concert {
  id: string;
  tourName: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  lat: number;
  lng: number;
  soldOut: boolean;
  capacity?: number;
}

export interface GalleryItem {
  id: string;
  type: "PHOTO" | "VIDEO" | "ARTWORK";
  url: string;
  caption: string;
  captionEn: string;
  era: string;
  tags: string[];
}
