import { RateOptions, Review } from '@/types/review';

export default function useFindMostFrequentRatingValue(reviews: Review[] | undefined) {
  if (!reviews || reviews.length === 0) {
    return {};
  }

  const ratingMap = new Map<RateOptions, number>([
    ['Exceptional', 0],
    ['Recommended', 0],
    ['Meh', 0],
    ['Bad', 0],
  ]);

  for (const review of reviews) {
    ratingMap.set(review.rate, (ratingMap.get(review.rate) || 0) + 1);
  }

  const higher = Array.from(ratingMap.entries()).reduce((acc, [k, v]) => {
      if (v > acc.value) {
        acc = { name: k, value: v };
      }

      return acc;
    },
    { name: 'Exceptional', value: 0 } as { name: RateOptions; value: number },
  );

  return { mostFrequentRating: higher };
}
