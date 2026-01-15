'use client';

// Force Edge Runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

import { useState } from 'react';
import { ReviewUploader } from '@/components/ReviewUploader';
import { ReviewPreview } from '@/components/ReviewPreview';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import { ReviewData, AnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { analyzeReviewsAction } from './actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDataLoaded = (data: ReviewData[]) => {
    setReviews(data);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
        const result = await analyzeReviewsAction(reviews);
        setAnalysisResult(result);
    } catch (err) {
        console.error(err);
        setError("분석 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 파일 데이터를 확인해주세요.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setReviews([]);
    setAnalysisResult(null);
    setError(null);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-gray-50/50">
      <div className="w-full max-w-6xl mb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Naver Review Insight <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          스마트스토어 리뷰 데이터를 업로드하면<br className="hidden md:block" />
          AI가 고객의 <span className="font-semibold text-gray-800">숨겨진 니즈</span>와 <span className="font-semibold text-gray-800">개선점</span>을 찾아드립니다.
        </p>
      </div>

      <div className="w-full max-w-6xl transition-all duration-300">
        <AnimatePresence mode="wait">
            {!analysisResult ? (
                // Upload & Preview Phase
                <motion.div 
                    key="upload-phase"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {reviews.length === 0 ? (
                    <ReviewUploader onDataLoaded={handleDataLoaded} />
                    ) : (
                        <div className="space-y-8">
                            <ReviewPreview 
                                data={reviews} 
                                onReset={handleReset} 
                            />
                            
                            {error && (
                                <div className="flex items-center justify-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg animate-in fade-in">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex justify-center pb-12">
                                <Button 
                                    size="lg" 
                                    className="text-lg px-10 py-7 rounded-full shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:scale-105 active:scale-95"
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
                </motion.div>
            ) : (
                // Analysis Result Phase
                <motion.div
                    key="result-phase"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <AnalysisDashboard 
                        result={analysisResult} 
                        onReset={handleReset} 
                    />
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto py-8 text-center text-sm text-gray-400">
        <p>© 2026 Naver Review Insight. Powered by Google Gemini.</p>
      </footer>
    </main>
  );
}