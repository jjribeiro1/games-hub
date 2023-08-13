import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { StorageReference, getDownloadURL } from 'firebase/storage';
import { db } from '@/firebase/config';
import { uploadFile } from './storage';
import { createGenre, getAllGenres, getGenreByName, updateGenre } from './genre';
import { createPlatform, getAllPlatforms, getPlatformByName, updatePlatform } from './platform';
import { createGameTypeSchema } from '@/lib/schemas/create-game';
import { AddDocFirebaseError } from '@/exceptions';
import { GamesFilters } from '@/types/games-filters';
import { Game } from '@/types/game';

export async function createGame(game: createGameTypeSchema) {
  const thumbnailFile = await uploadFile(`/thumbnail/${game.thumbnail[0].name}`, game.thumbnail[0]);
  const thumbnailRef = await getDownloadURL(thumbnailFile?.ref as StorageReference);
  const createdGame = await addDoc(collection(db, 'games'), {
    title: game.title,
    genre: game.genre,
    release_date: new Date(game.release_date),
    short_description: game.short_description,
    description: game.description,
    platform: game.platform,
    developer: game.developer,
    publisher: game.publisher,
    game_url: game.game_url,
    min_system_requirements: {
      os: game.min_system_requirements.os,
      processor: game.min_system_requirements.processor,
      graphics: game.min_system_requirements.graphics,
      memory: game.min_system_requirements.memory,
      storage: game.min_system_requirements.storage,
    },
    isFree: game.isFree,
    thumbnail: thumbnailRef,
  }).catch(() => {
    throw new AddDocFirebaseError();
  });

  await makeGameRelation(createdGame.id).catch(() => {
    throw new Error('Erro ao criar as relações do jogo');
  });
}

async function makeGameRelation(gameId: string) {
  const gameData = await getGameById(gameId);
  const genresSnapshot = await getAllGenres();
  const platformsSnapshot = await getAllPlatforms();
  const isNewPlatform = platformsSnapshot.docs.some((doc) => doc.data().name === gameData.platform) === false;
  const isNewGenre = genresSnapshot.docs.some((doc) => doc.data().name === gameData.genre) === false;

  if (isNewGenre) {
    await createGenre(gameData.genre, gameData.id);
  } else {
    const genre = await getGenreByName(gameData.genre);
    await updateGenre(genre.id, gameData.id);
  }

  if (isNewPlatform) {
    await createPlatform(gameData.platform, gameData.id);
  } else {
    const platform = await getPlatformByName(gameData.platform);
    await updatePlatform(platform.id, gameData.id);
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
