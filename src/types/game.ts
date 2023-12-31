import { MinimumSystemRequirements } from './resource-response';

export interface Game {
  id: string;
  title: string;
  description: string;
  developer: string;
  game_url: string;
  genre: string[];
  isFree: boolean;
  minimum_system_requirements: MinimumSystemRequirements;
  platform: string[];
  publisher: string;
  release_date: Date;
  screenshots: string[];
  short_description: string;
  thumbnail: string;
  createdAt: Date;
}

export interface CreateGameInput extends Omit<Game, 'id'> {}
