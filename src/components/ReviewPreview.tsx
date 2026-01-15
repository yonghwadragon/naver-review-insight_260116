import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ReviewData } from '@/types';
import { Star } from 'lucide-react';

interface ReviewPreviewProps {
  data: ReviewData[];
  onReset: () => void;
}

export function ReviewPreview({ data, onReset }: ReviewPreviewProps) {
  // Show only first 5 items for preview
  const previewData = data.slice(0, 5);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>데이터 미리보기</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            총 {data.length}개의 리뷰가 로드되었습니다. 분석하기 전에 데이터가 올바른지 확인하세요.
          </p>
        </div>
        <button 
            onClick={onReset}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
            다시 업로드
        </button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">평점</th>
                <th className="px-6 py-3">작성일</th>
                <th className="px-6 py-3">구매자</th>
                <th className="px-6 py-3">리뷰 내용</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((review, idx) => (
                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-1">
                    <span className="font-bold">{review.rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {String(review.date).substring(0, 10)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {review.userName}
                  </td>
                  <td className="px-6 py-4 max-w-md truncate">
                    {review.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 5 && (
            <div className="text-center mt-4 text-xs text-gray-400">
                ...외 {data.length - 5}개의 리뷰
            </div>
        )}
      </CardContent>
    </Card>
  );
}
