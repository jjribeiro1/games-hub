import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
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
  return { id: docSnap.id, ...docSnap.data() } as Game;
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

export async function getGamesByPlatform(platformName: string) {
  const platformQuery = query(collection(db, 'platforms'), where('name', '==', platformName));
  const platformSnapshot = await getDocs(platformQuery);

  if (platformSnapshot.empty) {
    return [];
  }

  const gamesId = platformSnapshot.docs[0].data().gamesId as string[];
  const gamesPromises = gamesId.map((gameId) => getDoc(doc(db, 'games', gameId)));

  const gamesSnapshots = await Promise.all(gamesPromises);
  const games = gamesSnapshots.map(
    (gameSnapshot) => ({ id: gameSnapshot.id, ...gameSnapshot.data() }) as Game,
  );

  return games;
}
