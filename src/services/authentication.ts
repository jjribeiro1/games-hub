import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { NewUserAuthenticationInput } from '@/types/new-user-auth-input';
import { checkUserUniqueFields, saveUserTofirestore } from './user';
import { NewUserAuthenticationError, UniqueFieldValidationError } from '@/exceptions';

export async function newUserAuthentication({ email, password, username }: NewUserAuthenticationInput) {
  try {
    await checkUserUniqueFields(email, username)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await saveUserTofirestore({ email: user.email as string, uid: user.uid, username });

    return user;
  } catch (error: any) {
    if (error instanceof UniqueFieldValidationError) {
      throw new Error(error.message);
    }
    throw new NewUserAuthenticationError();
  }
}
