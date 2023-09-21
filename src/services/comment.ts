import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Comment, CreateCommentInput } from '@/types/comment';

export async function createComment({ userId, username, gameId, text, createdAt }: CreateCommentInput) {
  await addDoc(collection(db, 'comments'), { userId, gameId, username, text, createdAt });
}

export async function getCommentsFromGame(gameId: string) {
  const q = query(collection(db, 'comments'), where('gameId', '==', gameId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const comments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Comment[];
  return comments;
}

export async function deleteComment(commentId: string) {
  const docRef = doc(db, 'comments', commentId);
  await deleteDoc(docRef);
}
