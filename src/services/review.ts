import { db } from '@/firebase/config';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { RatingOptions, Review } from '@/types/review';
import { Game } from '@/types/game';

export async function createReview(userId: string, gameId: string, rating: RatingOptions, comment: string = '') {
  const reviewId = `${userId}_${gameId}`;
  await setDoc(doc(db, 'reviews', reviewId), { userId, gameId, rating, comment });
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

export async function getAllReviewsFromGame(game: Game) {
  const q = query(collection(db, 'reviews'), where('gameId', '==', game.id));
  const snapshot = await getDocs(q);
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return reviews as Review[];
}

export async function getReviewById(userId: string, gameId: string) {
  const docRef = doc(db, 'reviews', `${userId}_${gameId}`);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() } as Review;
}

export async function updateReviewById(userId: string, gameId: string, data: Partial<Review>) {
  const { comment, rating } = data;
  const docRef = doc(db, 'reviews', `${userId}_${gameId}`);
  await updateDoc(docRef, {
    comment,
    rating,
  });
}
