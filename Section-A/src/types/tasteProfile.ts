export interface TasteProfile {
  userId: string;
  dimensions: Record<string, number>;
  insights: string[];
  confidence: number;
  dataPoints: number;
  updatedAt: string;
}