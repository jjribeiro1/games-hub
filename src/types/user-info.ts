import { Game } from './game';

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  library: UserLibrary[];
}

export type UserLibrary = {
  game: Game;
  type: GameInLibraryType;
};
export type GameInLibraryType = 'Uncategorized' | 'Currently Playing' | 'Completed' | 'Played' | 'Not Played';
