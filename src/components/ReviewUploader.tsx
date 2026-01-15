import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { ReviewData } from '@/types';

interface ReviewUploaderProps {
  onDataLoaded: (data: ReviewData[]) => void;
}

export function ReviewUploader({ onDataLoaded }: ReviewUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          throw new Error('파일에 데이터가 없습니다.');
        }

        // Normalize Data
        const normalizedData: ReviewData[] = jsonData.map((row: any, index) => {
            // Mapping Logic: Try to find common column names
            const rating = row['rating'] || row['평점'] || 0;
            const content = row['content'] || row['리뷰상세내용'] || row['내용'] || row['리뷰'] || '';
            const date = row['date'] || row['작성일'] || row['작성일자'] || new Date().toISOString();
            const option = row['option'] || row['옵션'] || row['옵션정보'] || '';
            const userName = row['userName'] || row['작성자'] || row['구매자명'] || `User ${index + 1}`;

            // Basic validation
            if (!content) {
                // Skip rows without content if necessary, or keep empty
            }

            return {
                id: index,
                rating: Number(rating),
                content: String(content),
                date: String(date),
                option: String(option),
                userName: String(userName)
            };
        }).filter(item => item.content.trim() !== ''); // Filter empty reviews

        if (normalizedData.length === 0) {
             throw new Error('유효한 리뷰 데이터를 찾을 수 없습니다. 컬럼명을 확인해주세요 (평점, 리뷰상세내용 등).');
        }

        onDataLoaded(normalizedData);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : '파일 파싱 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  }, [onDataLoaded]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <Card className={cn(
      "w-full max-w-2xl mx-auto border-2 border-dashed transition-colors duration-200",
      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200",
      "hover:border-blue-400"
    )}>
      <div
        className="p-12 flex flex-col items-center justify-center text-center cursor-pointer"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">리뷰 파일 업로드</h3>
        <p className="text-gray-500 mb-6">
          네이버 스마트스토어 엑셀(.xlsx) 또는 CSV 파일을<br />
          여기로 드래그하거나 클릭하여 업로드하세요.
        </p>
        
        <label className="relative">
          <Button type="button" className="pointer-events-none">
            파일 선택하기
          </Button>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInput}
          />
        </label>

        {isLoading && (
            <p className="mt-4 text-sm text-blue-600 animate-pulse">파일 분석 중...</p>
        )}

        {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
            </div>
        )}
        
        <div className="mt-6 text-xs text-gray-400 flex flex-col gap-1">
            <span>지원 형식: .xlsx, .csv</span>
            <span>필수 컬럼: 평점, 리뷰상세내용 (또는 내용)</span>
        </div>
      </div>
    </Card>
  );
}
