import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Genre } from '@/types/genre';

export async function getAllGenres() {
  const querySnapshot = await getDocs(collection(db, 'genres'));
  const genres = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Genre[];
  return genres;
}

export async function getGenreByName(name: string) {
  const q = query(collection(db, 'genres'), where('name', '==', name));
  const docSnap = await getDocs(q);
  return { id: docSnap.docs[0].id, ...docSnap.docs[0].data() } as Genre;
}

export async function createGenre(name: string, gameId: string) {
  await addDoc(collection(db, 'genres'), { name, gamesId: [gameId] });
}

export async function updateGenre(genreId: string, gameId: string) {
  const genreRef = doc(db, 'genres', genreId);
  await updateDoc(genreRef, {
    gamesId: arrayUnion(gameId),
  });
}
