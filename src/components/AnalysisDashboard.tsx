import React from 'react';
import { SummaryStats } from './SummaryStats';
import { SentimentChart } from './SentimentChart';
import { InsightCard } from './InsightCard';
import { AnalysisResult } from '@/types';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function AnalysisDashboard({ result, onReset }: AnalysisDashboardProps) {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">분석 결과 리포트</h2>
          <p className="text-gray-500 mt-1">AI가 발견한 주요 인사이트를 확인하세요.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={onReset}>
            다른 파일 분석
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            PDF 저장 (준비중)
          </Button>
        </div>
      </div>

      {/* 1. Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SummaryStats summary={result.summary} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2. Sentiment Chart (1/3 width) */}
        <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <SentimentChart summary={result.summary} />
        </motion.div>

        {/* 3. Keywords & Pain Points (2/3 width) */}
        <motion.div 
            className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
             <InsightCard 
                title="주요 키워드 Top 5" 
                items={result.keywords} 
                type="keyword" 
            />
            <InsightCard 
                title="핵심 불만 요소 (Pain Points)" 
                items={result.painPoints} 
                type="painPoint" 
            />
        </motion.div>
      </div>

      {/* 4. Strategic Insights */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <InsightCard 
            title="구매 결정 요인" 
            items={result.purchaseFactors} 
            type="factor" 
        />
        <InsightCard 
            title="AI 마케팅 제안" 
            items={result.marketingSuggestions} 
            type="suggestion" 
            className="border-blue-200 bg-blue-50/50"
        />
      </motion.div>
    </div>
  );
}
