import { arrayUnion, collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Platform } from '@/types/platform';

export async function getAllPlatforms() {
  const querySnapshot = await getDocs(collection(db, 'platforms'));
  const platforms = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Platform[];
  return platforms;
}

export async function createPlatform(data: Platform) {
  await setDoc(doc(db, 'platforms', data.id), { name: data.name, slug: data.slug, gamesId: data.gamesId });
}

export async function updatePlatformGamesId(platformId: string, gameId: string) {
  const platformRef = doc(db, 'platforms', platformId);
  await updateDoc(platformRef, {
    gamesId: arrayUnion(gameId),
  });
}

export async function checkForNewPlatforms(platformsId: string[]) {
  const currentPlatforms = await getAllPlatforms();
  const newPlatformsId: string[] = [];
  const oldPlatformsId: string[] = [];

  for (const platformId of platformsId) {
    if (currentPlatforms.some((platform) => platform.id === platformId)) {
      oldPlatformsId.push(platformId);
    } else {
      newPlatformsId.push(platformId);
    }
  }

  return {
    newPlatformsId,
    oldPlatformsId,
  };
}
