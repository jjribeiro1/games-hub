import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { StorageReference, getDownloadURL } from 'firebase/storage';
import { db } from '@/firebase/config';
import { uploadFile } from './storage';
import { createGameTypeSchema } from '@/lib/schemas/create-game';
import { AddDocFirebaseError } from '@/exceptions';
import { GamesFilters } from '@/types/games-filters';
import { Game } from '@/types/game';

export async function createGame(game: createGameTypeSchema) {
  const thumbnailFile = await uploadFile(`/thumbnail/${game.thumbnail[0].name}`, game.thumbnail[0]);
  const thumbnailRef = await getDownloadURL(thumbnailFile?.ref as StorageReference);

  await addDoc(collection(db, 'games'), {
    title: game.title,
    genre: game.genre,
    release_date: new Date(game.release_date),
    short_description: game.short_description,
    description: game.description,
    platform: game.platform,
    developer: game.developer,
    publisher: game.publisher,
    game_url: game.game_url,
    isFree: game.isFree,
    thumbnail: thumbnailRef,
  }).catch(() => {
    throw new AddDocFirebaseError();
  });
}

export async function getAllGames() {
  return getDocs(collection(db, 'games'));
}

export async function getGamesByFilters(filters: GamesFilters) {
  const q = query(collection(db, 'games'), where(filters.fieldPath, filters.operator, filters.value));
  return getDocs(q);
}

export async function getGameById(id: string) {
  const docRef = doc(db, 'games', id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Game;
}

export async function getGamesByGenre(genreName: string) {
  const genreQuery = query(collection(db, 'genres'), where('name', '==', genreName));
  const genreSnapshot = await getDocs(genreQuery);

  if (genreSnapshot.empty) {
    return [];
  }

  const gamesId = genreSnapshot.docs[0].data().gamesId as string[];
  const gamesPromises = gamesId.map((gameId) => getDoc(doc(db, 'games', gameId)));

  const gamesSnapshots = await Promise.all(gamesPromises);
  const games = gamesSnapshots.map(
    (gameSnapshot) => ({ id: gameSnapshot.id, ...gameSnapshot.data() }) as Game,
  );

  return games;
}
