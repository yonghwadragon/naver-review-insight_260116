# Project Blueprint

## Overview
**Project Name:** Naver Review Insight
**Goal:** A SaaS application that analyzes Naver Smart Store/Brand Store review files (Excel, CSV) using AI (Gemini) to provide insights, sentiment analysis, and improvement suggestions.
**Tech Stack:** Next.js (App Router), Tailwind CSS, Gemini 1.5 Pro, Lucide React, Recharts.
**Target Deployment:** Cloudflare Pages (Edge Runtime).

## Core Features (MVP)
1.  **File Upload:** Drag & Drop support for `.xlsx` or `.csv`. Client-side parsing.
2.  **AI Analysis (Gemini 1.5 Pro):**
    *   Sentiment Analysis (Positive/Negative ratio).
    *   Keyword Extraction (Top 5).
    *   Pain Point Analysis.
    *   Purchase Decision Factors.
3.  **Visualization Dashboard:**
    *   Summary Stats (Avg rating, Total count, Photo review ratio).
    *   Charts (Sentiment ratio).
    *   AI Actionable Strategies.

## Data Structure (Schema)
Upload file must contain:
- `rating`: Number (1-5)
- `content`: String (Review text)
- `date`: String/Date
- `option`: String (Purchased option)

## Current Plan: MVP Implementation
- [x] Initial Cleanup.
- [ ] **Step 1: Setup & Dependencies**
    - Install `xlsx` (parsing), `lucide-react` (icons), `recharts` (charts), `clsx`, `tailwind-merge`, `@google/generative-ai`.
    - Configure shared UI utilities.
- [ ] **Step 2: Frontend - File Upload**
    - Create `ReviewUploader` component.
    - Implement Excel/CSV parsing logic.
- [ ] **Step 3: Frontend - Dashboard UI**
    - Create dashboard layout.
    - Implement charts and stats display.
- [ ] **Step 4: Backend - AI Integration**
    - Set up Next.js API Route (Edge Runtime compatible).
    - Integrate Gemini 1.5 Pro for analysis.
- [ ] **Step 5: Integration**
    - Connect frontend upload to backend analysis.
    - Display results.

## Project History
- **Initial Setup:** Cleaned up default Next.js boilerplate files.