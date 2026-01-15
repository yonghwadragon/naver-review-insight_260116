'use server';

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { ReviewData, AnalysisResult } from '@/types';

// runtime config moved to page.tsx to avoid build error in server action file

export async function analyzeReviewsAction(reviews: ReviewData[]): Promise<AnalysisResult> {
  // Initialize inside the action to avoid static initialization issues in edge
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error('Google Gemini API Key is not configured.');
  }

  // 1. Data Preprocessing (Token Limit Handling)
  // Limit to most recent 200 reviews or max 50,000 chars to avoid token limits
  const MAX_REVIEWS = 200;
  const processedReviews = reviews
    .slice(0, MAX_REVIEWS)
    .map(r => `[Rating: ${r.rating}] ${r.content}`)
    .join('\n');

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
                summary: {
                    type: SchemaType.OBJECT,
                    properties: {
                        totalReviews: { type: SchemaType.NUMBER },
                        averageRating: { type: SchemaType.NUMBER },
                        positiveRatio: { type: SchemaType.NUMBER },
                        neutralRatio: { type: SchemaType.NUMBER },
                        negativeRatio: { type: SchemaType.NUMBER },
                    },
                    required: ["totalReviews", "averageRating", "positiveRatio", "neutralRatio", "negativeRatio"]
                },
                keywords: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                painPoints: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                purchaseFactors: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                marketingSuggestions: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                }
            },
            required: ["summary", "keywords", "painPoints", "purchaseFactors", "marketingSuggestions"]
        }
    }
  });

  const prompt = `
    You are an expert e-commerce data analyst. Analyze the following customer reviews from a Korean e-commerce platform (Naver Smart Store).
    
    Total Reviews Provided: ${reviews.length} (I may have truncated the list sent to you, but use the provided data to infer ratios).
    
    Analyze the sentiment, key topics, complaints, and buying reasons.
    Return the result in JSON format matching the schema.
    
    IMPORTANT:
    - All text outputs (keywords, painPoints, suggestions) MUST be in KOREAN.
    - 'totalReviews' should be the number of reviews I sent you (${Math.min(reviews.length, MAX_REVIEWS)}).
    - 'averageRating' calculate from the provided text data if possible, or estimate.
    - Ratios (positive/neutral/negative) must sum to 100.
    
    Reviews Data:
    ${processedReviews}
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText) as AnalysisResult;
    
    // Fallback: Ensure ratios sum to 100 if Gemini makes a math error
    const totalRatio = data.summary.positiveRatio + data.summary.neutralRatio + data.summary.negativeRatio;
    if (totalRatio !== 100 && totalRatio > 0) {
        data.summary.positiveRatio = Math.round((data.summary.positiveRatio / totalRatio) * 100);
        data.summary.negativeRatio = Math.round((data.summary.negativeRatio / totalRatio) * 100);
        data.summary.neutralRatio = 100 - data.summary.positiveRatio - data.summary.negativeRatio;
    }

    // Override total count with actual client count if needed, but Gemini's count of processed items is fine.
    // Let's use the actual input length for accuracy on the dashboard if we analyzed a subset.
    data.summary.totalReviews = reviews.length; 

    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error('AI Analysis failed. Please check the logs.');
  }
}