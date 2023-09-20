export interface Comment {
  id: string;
  userId: string;
  username: string;
  gameId: string;
  text: string;
  createdAt: Date;
}

export type CreateCommentInput = Omit<Comment, 'id'>;
