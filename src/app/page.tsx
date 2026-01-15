'use client';

import { useState } from 'react';
import { ReviewUploader } from '@/components/ReviewUploader';
import { ReviewPreview } from '@/components/ReviewPreview';
import { ReviewData, AnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleDataLoaded = (data: ReviewData[]) => {
    setReviews(data);
    setAnalysisResult(null); // Reset previous analysis if any
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // TODO: Implement API call to Gemini
    setTimeout(() => {
        setIsAnalyzing(false);
        alert("AI 분석 기능은 다음 단계에서 구현됩니다!");
    }, 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-5xl mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Naver Review Insight <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          스마트스토어 리뷰 데이터를 업로드하면 AI가 고객의 숨겨진 니즈와 개선점을 찾아드립니다.
        </p>
      </div>

      <div className="w-full max-w-5xl">
        {reviews.length === 0 ? (
          <ReviewUploader onDataLoaded={handleDataLoaded} />
        ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ReviewPreview 
                    data={reviews} 
                    onReset={() => setReviews([])} 
                />
                
                <div className="flex justify-center">
                    <Button 
                        size="lg" 
                        className="text-lg px-8 py-6 rounded-full shadow-lg shadow-blue-200"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <>
                                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                AI가 리뷰를 분석하는 중...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                AI 인사이트 분석 시작하기
                            </>
                        )}
                    </Button>
                </div>
            </div>
        )}
      </div>

      <footer className="mt-auto py-8 text-center text-sm text-gray-400">
        <p>© 2026 Naver Review Insight. Powered by Gemini 1.5 Pro.</p>
      </footer>
    </main>
  );
}
