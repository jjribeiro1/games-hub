import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Platform } from '@/types/platform';

export async function getAllPlatforms() {
  return getDocs(collection(db, 'platforms'));
}

export async function getPlatformByName(name: string) {
  const q = query(collection(db, 'platforms'), where('name', '==', name));
  const docSnap = await getDocs(q);
  return { id: docSnap.docs[0].id, ...docSnap.docs[0].data() } as Platform;
}

export async function createPlatform(name: string, gameId: string) {
  await addDoc(collection(db, 'platforms'), { name, gamesId: [gameId] });
}

export async function updatePlatform(genreId: string, gameId: string) {
  const genreRef = doc(db, 'platforms', genreId);
  await updateDoc(genreRef, {
    gamesId: arrayUnion(gameId),
  });
}
