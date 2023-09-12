export interface Review {
  id: string;
  userId: string;
  gameId: string;
  rate: RateOptions;
  comment: string;
}

export type RateOptions = 'Exceptional' | 'Recommended' | 'Meh' | 'Bad'
