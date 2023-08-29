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

export class NewUserAuthenticationError extends Error {
  constructor(message = 'unexpected error, could not create a new account') {
    super(message);
    this.name = 'NewUserAuthenticationError';
  }
}

export class UniqueFieldValidationError extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = 'UniqueFieldValidationError';
  }
}

export class InvalidLoginCredentialsError extends Error {
  constructor(message = 'Invalid login credentials. Review your information and try again.') {
    super(message);
    this.name = 'InvalidLoginCredentialsError';
  }
}
