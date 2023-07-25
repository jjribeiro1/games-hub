export class UploadImageError extends Error {
  constructor(message = 'Erro ao fazer upload da imagem') {
    super(message);
    this.name = 'UploadImageError';
  }
}

export class AddDocFirebaseError extends Error {
  constructor(message = 'Erro ao criar documento no firebase') {
    super(message);
    this.name = 'AddDocFirebaseError';
  }
}
