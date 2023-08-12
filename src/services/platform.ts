import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function getAllPlatforms() {
  return getDocs(collection(db, 'platforms'));
}