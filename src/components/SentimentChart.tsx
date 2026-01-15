'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AnalysisResult } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SentimentChartProps {
  summary: AnalysisResult['summary'];
}

export function SentimentChart({ summary }: SentimentChartProps) {
  const data = [
    { name: '긍정', value: summary.positiveRatio, color: '#22c55e' }, // Green-500
    { name: '중립', value: summary.neutralRatio, color: '#94a3b8' },  // Slate-400
    { name: '부정', value: summary.negativeRatio, color: '#ef4444' }, // Red-500
  ].filter(item => item.value > 0);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>감성 분석 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number | string | Array<number | string>) => {
                  if (typeof value === 'number') return `${value}%`;
                  return value;
                }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}