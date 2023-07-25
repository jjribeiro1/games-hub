import { storage } from '@/firebase/config';
import { ref, uploadBytes } from 'firebase/storage';
import { UploadImageError } from '@/exceptions';

export async function uploadFile(storagePath: string, file: File) {
  const fileRef = ref(storage, storagePath);
  return uploadBytes(fileRef, file).catch(() => {
    throw new UploadImageError();
  });
}
