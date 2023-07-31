import { collection, addDoc, getDocs } from 'firebase/firestore';
import { StorageReference, getDownloadURL } from 'firebase/storage';
import { db } from '@/firebase/config';
import { uploadFile } from './storage';
import { createGameTypeSchema } from '@/lib/schemas/create-game';
import { AddDocFirebaseError } from '@/exceptions';

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
    thumbnail: thumbnailRef,
  }).catch(() => {
    throw new AddDocFirebaseError();
  });
}

export async function getAllGames() {
  return getDocs(collection(db, 'games'));
}
