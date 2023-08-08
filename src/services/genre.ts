import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function getAllGenres() {
  return getDocs(collection(db, 'genres'));
}
