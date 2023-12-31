export interface RootObject {
  id: number;
  title: string;
  description: string;
  developer: string;
  freetogame_profile_url: string;
  game_url: string;
  genre: string;
  minimum_system_requirements: MinimumSystemRequirements;
  platform: string;
  publisher: string;
  release_date: string;
  screenshots: Screenshot[];
  short_description: string;
  status: string;
  thumbnail: string;
}

export interface MinimumSystemRequirements {
  graphics: string | null;
  memory: string | null;
  os: string | null;
  processor: string | null;
  storage: string | null;
}

export interface Screenshot {
  id: number;
  image: string;
}
