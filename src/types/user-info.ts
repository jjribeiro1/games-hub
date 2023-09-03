import { Game } from './game';

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  library: GameInLibrary[];
}

export type GameInLibrary = {
  type: GameTypeInLibraryOption;
} & Game;

export type GameTypeInLibraryOption =
  | 'Uncategorized'
  | 'Currently Playing'
  | 'Completed'
  | 'Played'
  | 'Not Played';
