export interface AnikotoAnime {
  id: number;
  title: string;
  alternative: string;
  slug: string;
  rating: string;
  poster: string;
  is_sub?: number;
  is_dub?: number;
  description: string;
  aired: string;
  season: string;
  year: number;
  duration: string;
  status: string;
  score: string;
  mal_id: string;
  episodes: string;
  ani_id: string;
  source: string;
  background_image: string;
  terms_by_type: {
    genre?: string[];
    producers?: string[];
    studios?: string[];
    type?: string[];
  };
}

export interface AnikotoEpisode {
  id: number;
  title: string;
  jp_title: string;
  number: number;
  episode_embed_id: string;
  embed_url: {
    sub: string;
    dub: string;
  };
  updated_at: string;
}

export interface AnikotoRecentResponse {
  ok: boolean;
  data: AnikotoAnime[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface AnikotoSeriesResponse {
  ok: boolean;
  data: {
    anime: AnikotoAnime;
    episodes: AnikotoEpisode[];
  };
}

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number | null;
  episodes: number | null;
  synopsis: string | null;
  status: string;
  rating: string | null;
  year: number | null;
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  type: string | null;
}

export interface JikanSearchResponse {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}
