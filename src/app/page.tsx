'use client';

import { useState } from 'react';
import { ReviewUploader } from '@/components/ReviewUploader';
import { ReviewPreview } from '@/components/ReviewPreview';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import { ReviewData, AnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleDataLoaded = (data: ReviewData[]) => {
    setReviews(data);
    setAnalysisResult(null); 
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI Delay
    setTimeout(() => {
        // Dummy Data for MVP Demonstration
        const dummyResult: AnalysisResult = {
            summary: {
                totalReviews: reviews.length,
                averageRating: 4.2,
                positiveRatio: 75,
                neutralRatio: 10,
                negativeRatio: 15
            },
            keywords: ["배송이 빨라요", "가성비 좋아요", "디자인 예쁨", "재질이 튼튼함", "마감 처리 깔끔"],
            painPoints: ["포장이 약간 부실함", "설명서가 부족해요", "생각보다 무게가 있음"],
            purchaseFactors: ["빠른 배송 보장", "저렴한 가격 대비 품질", "심플한 디자인"],
            marketingSuggestions: [
                "포장재를 에어캡으로 보강하여 '안심 배송' 키워드 강조",
                "상세 페이지에 사용 가이드 영상 추가하여 문의 감소 유도",
                "포토 리뷰 이벤트 배너를 상단에 배치하여 전환율 증대"
            ]
        };

        setAnalysisResult(dummyResult);
        setIsAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setReviews([]);
    setAnalysisResult(null);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-6xl mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Naver Review Insight <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          스마트스토어 리뷰 데이터를 업로드하면 AI가 고객의 숨겨진 니즈와 개선점을 찾아드립니다.
        </p>
      </div>

      <div className="w-full max-w-6xl">
        {!analysisResult ? (
            // Upload & Preview Phase
            <>
                {reviews.length === 0 ? (
                <ReviewUploader onDataLoaded={handleDataLoaded} />
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ReviewPreview 
                            data={reviews} 
                            onReset={handleReset} 
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
            </>
        ) : (
            // Analysis Result Phase
            <AnalysisDashboard 
                result={analysisResult} 
                onReset={handleReset} 
            />
        )}
      </div>

      <footer className="mt-auto py-8 text-center text-sm text-gray-400">
        <p>© 2026 Naver Review Insight. Powered by Gemini 1.5 Pro.</p>
      </footer>
    </main>
  );
}