import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { checkUserUniqueFields, saveUserTofirestore } from './user';
import {
  InvalidLoginCredentialsError,
  NewUserAuthenticationError,
  UniqueFieldValidationError,
} from '@/exceptions';
import { NewUserAuthenticationInput } from '@/types/new-user-auth-input';
import { LoginInput } from '@/types/login-input';

export async function newUserAuthentication({ email, password, username, name }: NewUserAuthenticationInput) {
  try {
    await checkUserUniqueFields(email, username);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    await saveUserTofirestore({ email: user.email as string, uid: user.uid, username, name });

    return user;
  } catch (error: any) {
    if (error instanceof UniqueFieldValidationError) {
      throw new Error(error.message);
    }
    throw new NewUserAuthenticationError();
  }
}

export async function login({ email, password }: LoginInput) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error: any) {
    if (
      error.message === 'Firebase: Error (auth/wrong-password).' ||
      error.message === 'Firebase: Error (auth/user-not-found).'
    ) {
      throw new InvalidLoginCredentialsError();
    }

    throw new Error('unexpected error, try again later');
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('unexpected error, try again later');
  }
}
