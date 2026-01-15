export interface ReviewData {
  id?: string | number;
  rating: number;
  content: string;
  date: string;
  option?: string;
  userName?: string;
}

export interface AnalysisResult {
  summary: {
    totalReviews: number;
    averageRating: number;
    positiveRatio: number; // 0-100
    negativeRatio: number; // 0-100
    neutralRatio: number; // 0-100
  };
  keywords: string[];
  painPoints: string[];
  purchaseFactors: string[];
  marketingSuggestions: string[];
}
