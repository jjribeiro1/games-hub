import { Game } from './game';

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  library: UserLibrary[];
}

export type UserLibrary = {
  game: GameInLibrary;
};

export type GameInLibrary = {
  type: GameInLibraryOptions;
} & Game;

export type GameInLibraryOptions = 'Uncategorized' | 'Currently Playing' | 'Completed' | 'Played' | 'Not Played';