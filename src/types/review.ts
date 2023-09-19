export interface Review {
  id: string;
  userId: string;
  username: string;
  gameId: string;
  rating: RatingOptions;
  comment: string;
}

export interface CreateReviewInput {
  userId: string;
  username: string;
  gameId: string;
  rating: RatingOptions;
  comment?: string;
}

export type RatingOptions = 'Exceptional' | 'Recommended' | 'Meh' | 'Bad';
