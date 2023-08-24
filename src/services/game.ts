import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { checkForNewPlatforms, createPlatform, updatePlatformGamesId } from './platform';
import { checkForNewGenres, createGenre, updateGenreGamesId } from './genre';
import { AddDocFirebaseError } from '@/exceptions';
import { GamesFilters } from '@/types/games-filters';
import { CreateGameInput, Game } from '@/types/game';

export async function createGame(game: CreateGameInput) {
  const createdGame = await addDoc(collection(db, 'games'), game).catch(() => {
    throw new AddDocFirebaseError();
  });

  await makeGameRelation(createdGame.id).catch((error) => {
    throw new Error(`Erro ao criar as relações do jogo: ${error.message}`);
  });
}

async function makeGameRelation(gameId: string) {
  const gameData = await getGameById(gameId);
  const { newPlatformsId, oldPlatformsId } = await checkForNewPlatforms(gameData.platform);
  const { newGenresId, oldGenresId } = await checkForNewGenres(gameData.genre);

  if (newPlatformsId.length > 0) {
    newPlatformsId.forEach(async (platformId) => {
      await createPlatform({
        id: platformId,
        slug: platformId,
        name: platformId,
        gamesId: [gameData.id],
      });
    });
  }

  if (oldPlatformsId.length > 0) {
    oldPlatformsId.forEach(async (id) => {
      await updatePlatformGamesId(id, gameData.id);
    });
  }

  if (newGenresId.length > 0) {
    newGenresId.forEach(async (genreId) => {
      await createGenre({
        id: genreId,
        slug: genreId,
        name: genreId,
        gamesId: [gameData.id],
      });
    });
  }

  if (oldGenresId.length > 0) {
    oldGenresId.forEach(async (id) => {
      await updateGenreGamesId(id, gameData.id);
    });
  }
}

export async function getAllGames({ pageParam }: any) {
  let q = query(collection(db, 'games'), limit(8));
  if (pageParam) {
    q = query(collection(db, 'games'), limit(8), startAfter(pageParam));
  }
  const snapshot = await getDocs(q);
  const games = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Game[];
  return {
    games,
    lastDocRef: snapshot.docs[snapshot.docs.length - 1],
  };
}

export async function getGamesByFilters({ fieldPath, operator, value, sortBy }: GamesFilters) {
  let q = query(collection(db, 'games'), where(fieldPath, operator, value));
  if (sortBy) {
    q = query(
      collection(db, 'games'),
      where(fieldPath, operator, value),
      orderBy(sortBy.fieldPath, sortBy.value),
    );
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Game[];
}

export async function getGameById(id: string) {
  const docRef = doc(db, 'games', id);
  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...docSnap.data() } as Game;
}
