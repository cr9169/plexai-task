export interface HighlightOrRisk {
  title: string;
  description: string;
}

export interface AiAnalysisResult {
  highlights: HighlightOrRisk[];
  risks: HighlightOrRisk[];
  overallRisk: 'low' | 'medium' | 'high';
  summary: string;
}
