export const formatGenrePath = (str: string) => str.replaceAll(' ', '-').toLowerCase();

export const genresMap = new Map<string, string>();
genresMap.set('shooter', 'Shooter');
genresMap.set('mmorpg', 'MMORPG');
genresMap.set('card-game', 'Card Game');
genresMap.set('social', 'Social');
genresMap.set('mmo', 'MMO');

export const getOriginalGenreName = (formattedName: string) => genresMap.get(formattedName);
