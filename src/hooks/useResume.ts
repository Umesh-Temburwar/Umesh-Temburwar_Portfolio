import { useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export interface ResumeMetadata {
  url: string;
  downloadUrl?: string;
  filename: string;
  size: number | null;
  uploadedAt: string | null;
  exists: boolean;
  isFallback?: boolean;
}

export function useResume() {
  const { data, isLoading, lastSaved } = usePortfolio();
  const pdfUrl = data.resume?.pdfUrl || '';
  const exists = Boolean(data.resume?.exists && pdfUrl);

  const cacheBustedUrl = useMemo(() => {
    if (!pdfUrl) return '';
    if (pdfUrl.startsWith('data:')) return pdfUrl;
    const separator = pdfUrl.includes('?') ? '&' : '?';
    const version = lastSaved ? encodeURIComponent(lastSaved) : String(Date.now());
    return `${pdfUrl}${separator}v=${version}`;
  }, [pdfUrl, lastSaved]);

  return {
    url: cacheBustedUrl || pdfUrl,
    downloadUrl: cacheBustedUrl || pdfUrl,
    filename: 'Umesh_Temburwar_Resume.pdf',
    size: null,
    uploadedAt: lastSaved,
    exists,
    isFallback: false,
    isLoading,
    error: null as string | null,
    refresh: async () => undefined,
  };
}
