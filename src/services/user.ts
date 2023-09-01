import {
  setDoc,
  doc,
  query,
  collection,
  or,
  where,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { UniqueFieldValidationError } from '@/exceptions';
import { SaveUserToFirestoreInput } from '@/types/save-user-to-firestore-input';
import { GameInLibraryType, UserInfo } from '@/types/user-info';
import { Game } from '@/types/game';

export async function saveUserTofirestore({ email, uid, username }: SaveUserToFirestoreInput) {
  await setDoc(doc(db, 'users', uid), { email, username });
}

export async function checkUserUniqueFields(email: string, username: string) {
  const duplicateFields: string[] = [];
  let q = query(collection(db, 'users'), or(where('email', '==', email), where('username', '==', username)));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return;
  }

  const duplicateEmail = snapshot.docs.some((doc) => doc.data().email === email);
  const duplicateUsername = snapshot.docs.some((doc) => doc.data().username === username);

  if (duplicateEmail) {
    duplicateFields.push('email');
  }
  if (duplicateUsername) {
    duplicateFields.push('username');
  }
  const message = `Fields: ${duplicateFields.join(', ')} are already in use by another user`;
  throw new UniqueFieldValidationError(message);
}

export async function getUserById(id: string) {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...docSnap.data() } as UserInfo;
}

export async function addGameToUserLibrary(userId: string, game: Game, type: GameInLibraryType) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    library: arrayUnion({ game, type }),
  });
}
