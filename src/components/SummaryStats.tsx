import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AnalysisResult } from '@/types';
import { Star, MessageSquare, ThumbsUp, AlertCircle } from 'lucide-react';

interface SummaryStatsProps {
  summary: AnalysisResult['summary'];
}

export function SummaryStats({ summary }: SummaryStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 리뷰 수</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalReviews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground text-gray-500">
            분석된 전체 데이터
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground text-gray-500">
            5.0 만점 기준
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">긍정 리뷰 비율</CardTitle>
          <ThumbsUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.positiveRatio}%</div>
          <p className="text-xs text-muted-foreground text-gray-500">
            긍정적 감정 분석 결과
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">부정 리뷰 비율</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.negativeRatio}%</div>
          <p className="text-xs text-muted-foreground text-gray-500">
            개선이 필요한 영역
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
