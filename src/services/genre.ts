import { arrayUnion, collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Genre } from '@/types/genre';

export async function getAllGenres() {
  const querySnapshot = await getDocs(collection(db, 'genres'));
  const genres = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Genre[];
  return genres;
}

export async function createGenre(data: Genre) {
  await setDoc(doc(db, 'genres', data.id), { name: data.name, slug: data.slug, gamesId: data.gamesId });
}

export async function updateGenreGamesId(genreId: string, gameId: string) {
  const genreRef = doc(db, 'genres', genreId);
  await updateDoc(genreRef, {
    gamesId: arrayUnion(gameId),
  });
}

export async function checkForNewGenres(genresId: string[]) {
  const currentGenres = await getAllGenres();
  const newGenresId: string[] = [];
  const oldGenresId: string[] = [];

  for (const genreId of genresId) {
    if (currentGenres.some((genre) => genre.id === genreId)) {
      oldGenresId.push(genreId);
    } else {
      newGenresId.push(genreId);
    }
  }

  return {
    newGenresId,
    oldGenresId,
  };
}
