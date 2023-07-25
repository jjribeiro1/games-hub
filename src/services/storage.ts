import { storage } from '@/firebase/config';
import { ref, uploadBytes } from 'firebase/storage';

export function uploadFile(storagePath: string, file: File) {
  try {
    const fileRef = ref(storage, storagePath);
    return uploadBytes(fileRef, file);
  } catch (error) {
    console.log(error);
  }
}
