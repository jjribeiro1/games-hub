import { MinimumSystemRequirements } from './resource-response';

export interface Game {
  id: string;
  title: string;
  description: string;
  developer: string;
  game_url: string;
  genre: string;
  isFree: boolean;
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
