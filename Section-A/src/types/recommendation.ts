export interface Recommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  matchPercentage: number;
  tags: string[];
  reasonsForRecommendation: string[];
}