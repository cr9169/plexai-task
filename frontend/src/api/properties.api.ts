import { apiFetch } from './client';
import type {
  AiAnalysisResult,
  GetPropertiesQuery,
  PaginatedProperties,
  Property,
  UnderwritingResult,
} from '../types/property.types';

export function getProperties(query: GetPropertiesQuery): Promise<PaginatedProperties> {
  const params = new URLSearchParams();
  if (query.city !== undefined) params.set('city', query.city);
  if (query.type !== undefined) params.set('type', query.type);
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
  if (query.page !== undefined) params.set('page', String(query.page));
  if (query.limit !== undefined) params.set('limit', String(query.limit));

  const queryString = params.toString();
  return apiFetch<PaginatedProperties>(`/properties${queryString ? `?${queryString}` : ''}`);
}

export function getProperty(id: string): Promise<Property> {
  return apiFetch<Property>(`/properties/${id}`);
}

export function getUnderwriting(id: string): Promise<UnderwritingResult> {
  return apiFetch<UnderwritingResult>(`/properties/${id}/underwriting`);
}

export function postAiAnalysis(id: string, focusAreas?: string[]): Promise<AiAnalysisResult> {
  return apiFetch<AiAnalysisResult>(`/properties/${id}/ai-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ focusAreas }),
  });
}
