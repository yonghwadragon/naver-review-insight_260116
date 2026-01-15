import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  items: string[];
  type: 'keyword' | 'painPoint' | 'factor' | 'suggestion';
  className?: string;
}

export function InsightCard({ title, items, type, className }: InsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'keyword': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'painPoint': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'factor': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'suggestion': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getBgColor = () => {
     switch (type) {
      case 'keyword': return "bg-blue-50 border-blue-100";
      case 'painPoint': return "bg-red-50 border-red-100";
      case 'factor': return "bg-green-50 border-green-100";
      case 'suggestion': return "bg-yellow-50 border-yellow-100";
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getIcon()}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className={cn("text-sm p-3 rounded-md border", getBgColor())}>
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
