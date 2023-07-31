import { MinimumSystemRequirements } from './resource-response';

export interface Game {
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

export interface Screenshot {
  image: string;
}
