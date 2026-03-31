import localforage from 'localforage';
import type { PDFDocumentProxy } from 'pdfjs-dist';

const PDF_STORE = localforage.createInstance({ name: 'pdf-reader' });

// In-memory cache that survives component unmount but not full page reload
let memoryCache: {
  doc: PDFDocumentProxy;
  dataUrl: string;
  fileName: string;
  thumbnails: Map<number, string>;
  currentPage: number;
  zoom: number;
} | null = null;

export function getPdfMemoryCache() {
  return memoryCache;
}

export function setPdfMemoryCache(cache: typeof memoryCache) {
  memoryCache = cache;
}

export function clearPdfMemoryCache() {
  memoryCache = null;
}

interface PdfMeta {
  fileName: string;
  currentPage: number;
  zoom: number;
  showQuiz?: boolean;
  quizQuestions?: any[];
}

export async function savePdfFile(dataUrl: string, fileName: string, page: number, zoom: number) {
  await PDF_STORE.setItem('pdf-data', dataUrl);
  await PDF_STORE.setItem('pdf-meta', { fileName, currentPage: page, zoom } as PdfMeta);
}

export async function loadPdfState(): Promise<{ dataUrl: string; meta: PdfMeta } | null> {
  const dataUrl = await PDF_STORE.getItem<string>('pdf-data');
  const meta = await PDF_STORE.getItem<PdfMeta>('pdf-meta');
  if (!dataUrl || !meta) return null;
  return { dataUrl, meta };
}

export async function updatePdfMeta(updates: Partial<PdfMeta>) {
  const meta = await PDF_STORE.getItem<PdfMeta>('pdf-meta');
  if (meta) {
    await PDF_STORE.setItem('pdf-meta', { ...meta, ...updates });
  }
}

export async function clearPdfState() {
  await PDF_STORE.removeItem('pdf-data');
  await PDF_STORE.removeItem('pdf-meta');
}
