import { db } from '@/firebase/config';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

export async function createReview(userId: string, gameId: string, rate: string, comment: string = '') {
  const reviewId = `${userId}_${gameId}`;
  await setDoc(doc(db, 'reviews', reviewId), { userId, gameId, rate, comment });
}

export async function deleteReview(userId: string, gameId: string) {
  const reviewId = `${userId}_${gameId}`;
  const docRef = doc(db, 'reviews', reviewId);
  await deleteDoc(docRef);
}

export async function getAllReviewsFromUser(userId: string) {
  const q = query(collection(db, 'reviews'), where('userId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
