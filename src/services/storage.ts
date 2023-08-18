import { storage } from '@/firebase/config';
import { StorageReference, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { UploadImageError } from '@/exceptions';

export async function uploadFile(storagePath: string, file: File) {
  const storageRef = ref(storage, storagePath);

  return uploadBytes(storageRef, file).catch(() => {
    throw new UploadImageError();
  });
}

export async function getImageDownloadUrl(ref: StorageReference) {
  return await getDownloadURL(ref);
}
