import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, ZoomIn, ZoomOut, MessageSquare, RotateCcw, Languages, Brain, Loader2, ChevronDown, Sparkles, Columns2, AlignJustify, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { PdfAutoPlay } from './PdfAutoPlay';
import { PdfChatSidebar } from './PdfChatSidebar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import { savePdfFile, loadPdfState, updatePdfMeta, clearPdfState, getPdfMemoryCache, setPdfMemoryCache, clearPdfMemoryCache } from '@/lib/pdfStorage';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-chat`;

type LangOption = 'english' | 'hindi' | 'hinglish';
type ViewMode = 'split' | 'overlay';
type QuizType = 'mcq' | 'true_false' | 'fill_blank' | 'multiple_correct' | 'short';

const LANG_LABELS: Record<LangOption, string> = {
  english: 'English',
  hindi: 'हिंदी',
  hinglish: 'Hinglish',
};

const QUIZ_TYPE_LABELS: Record<QuizType, string> = {
  mcq: 'MCQ',
  true_false: 'True / False',
  fill_blank: 'Fill in the Blanks',
  multiple_correct: 'Multiple Correct',
  short: 'Short Answer',
};

async function extractTextFromPages(doc: pdfjsLib.PDFDocumentProxy, from: number, to: number): Promise<string> {
  const texts: string[] = [];
  for (let i = from; i <= to; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const t = content.items.map((item: any) => item.str).join(' ');
    texts.push(`--- Page ${i} ---\n${t}`);
  }
  return texts.join('\n\n');
}

async function extractSinglePageText(doc: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<string> {
  const page = await doc.getPage(pageNum);
  const content = await page.getTextContent();
  return content.items.map((item: any) => item.str).join(' ');
}



export function PdfReaderView() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const onBack = () => navigate('/');

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return Math.max(0.5, (window.innerWidth - 32) / 612);
    }
    return 1.2;
  });
  const [fileName, setFileName] = useState('');
  const [restoringPdf, setRestoringPdf] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [pageText, setPageText] = useState('');
  const [thumbnails, setThumbnails] = useState<Map<number, string>>(new Map());
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const isRenderingRef = useRef(false);

  const [translatedText, setTranslatedText] = useState<Map<string, string>>(new Map());
  const [showTranslation, setShowTranslation] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState<LangOption>('english');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const translateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const prefetchAbortRef = useRef<AbortController | null>(null);

  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizFrom, setQuizFrom] = useState(1);
  const [quizTo, setQuizTo] = useState(1);
  const [quizCount, setQuizCount] = useState(5);
  const [customQuizCount, setCustomQuizCount] = useState('');
  const [quizTypes, setQuizTypes] = useState<Set<QuizType>>(new Set(['mcq', 'true_false', 'fill_blank', 'multiple_correct', 'short']));

  const [summarizeOpen, setSummarizeOpen] = useState(false);
  const [sumFrom, setSumFrom] = useState(1);
  const [sumTo, setSumTo] = useState(1);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const triggerSummarizeRef = useRef<((text: string, prompt: string) => void) | null>(null);

  const swipeGoNext = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  }, [currentPage, totalPages]);
  const swipeGoPrev = useCallback(() => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  }, [currentPage]);

  const { swipeHandlers, swipeOffset, swipeDirection, isAnimating } = useSwipeNavigation({
    onSwipeLeft: swipeGoNext,
    onSwipeRight: swipeGoPrev,
    threshold: 60,
    enabled: isMobile && !!pdfDoc && !showChat,
  });

  // Page fold transform style
  const pageFoldStyle = useMemo(() => {
    if (!swipeDirection && !isAnimating) return {};
    const progress = Math.min(Math.abs(swipeOffset) / (window.innerWidth * 0.6), 1);
    const rotateY = swipeDirection === 'left' ? -progress * 25 : progress * 25;
    const scale = 1 - progress * 0.04;
    const shadow = progress * 30;
    return {
      transform: `perspective(1200px) rotateY(${rotateY}deg) scale(${scale}) translateX(${swipeOffset * 0.15}px)`,
      transition: isAnimating ? 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      boxShadow: swipeDirection === 'left'
        ? `inset ${shadow}px 0 ${shadow * 1.5}px -${shadow * 0.5}px rgba(0,0,0,0.15)`
        : `inset -${shadow}px 0 ${shadow * 1.5}px -${shadow * 0.5}px rgba(0,0,0,0.15)`,
      transformOrigin: swipeDirection === 'left' ? 'right center' : 'left center',
    };
  }, [swipeOffset, swipeDirection, isAnimating]);

  const toggleQuizType = (type: QuizType) => {
    setQuizTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const renderPage = useCallback(async (doc: pdfjsLib.PDFDocumentProxy, pageNum: number, scale: number) => {
    if (!mainCanvasRef.current || isRenderingRef.current) return;
    isRenderingRef.current = true;
    setIsRendering(true);
    try {
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = mainCanvasRef.current;
      const ctx = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      setPageText(text);
    } catch (e) {
      console.error('Error rendering page:', e);
    }
    isRenderingRef.current = false;
    setIsRendering(false);
  }, []);

  const renderThumbnail = useCallback(async (doc: pdfjsLib.PDFDocumentProxy, pageNum: number) => {
    try {
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      return canvas.toDataURL();
    } catch {
      return '';
    }
  }, []);

  const loadPdfFromDataUrl = useCallback(async (dataUrl: string, name: string, page: number, z: number) => {
    const resp = await fetch(dataUrl);
    const ab = await resp.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: ab }).promise;
    setPdfDoc(doc);
    setTotalPages(doc.numPages);
    setFileName(name);
    setCurrentPage(page);
    setZoom(z);
    setThumbnails(new Map());
    setTranslatedText(new Map());
    setShowTranslation(false);
    setActiveLanguage('english');

    await renderPage(doc, page, z);

    const thumbMap = new Map<number, string>();
    const batch = Math.min(doc.numPages, 20);
    for (let i = 1; i <= batch; i++) {
      const data = await renderThumbnail(doc, i);
      thumbMap.set(i, data);
      if (i % 5 === 0) setThumbnails(new Map(thumbMap));
    }
    setThumbnails(new Map(thumbMap));

    if (doc.numPages > batch) {
      (async () => {
        for (let i = batch + 1; i <= doc.numPages; i++) {
          const data = await renderThumbnail(doc, i);
          thumbMap.set(i, data);
          if (i % 10 === 0) setThumbnails(new Map(thumbMap));
        }
        setThumbnails(new Map(thumbMap));
      })();
    }
  }, [renderPage, renderThumbnail]);

  // Restore PDF: check in-memory cache first, then fall back to IndexedDB
  useEffect(() => {
    const cached = getPdfMemoryCache();
    if (cached) {
      // Instant restore from memory — no re-parse needed
      setPdfDoc(cached.doc);
      setTotalPages(cached.doc.numPages);
      setFileName(cached.fileName);
      setCurrentPage(cached.currentPage);
      setZoom(cached.zoom);
      setThumbnails(new Map(cached.thumbnails));
      setTranslatedText(new Map());
      setShowTranslation(false);
      setActiveLanguage('english');
      renderPage(cached.doc, cached.currentPage, cached.zoom);
      setRestoringPdf(false);
      return;
    }
    loadPdfState().then(saved => {
        if (saved) {
        const { dataUrl, meta } = saved;
        loadPdfFromDataUrl(dataUrl, meta.fileName || '', meta.currentPage || 1, meta.zoom || 1.2)
          .finally(() => setRestoringPdf(false));
      } else {
        setRestoringPdf(false);
      }
    }).catch(() => setRestoringPdf(false));
  }, []);

  // Persist page/zoom changes to IndexedDB
  useEffect(() => {
    if (!pdfDoc) return;
    updatePdfMeta({ currentPage, zoom });
  }, [currentPage, zoom, pdfDoc]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    setPdfDoc(doc);
    setTotalPages(doc.numPages);
    setCurrentPage(1);
    setThumbnails(new Map());
    setTranslatedText(new Map());
    setShowTranslation(false);
    setActiveLanguage('english');

    // Save to IndexedDB (no size limit)
    const reader = new FileReader();
    reader.onload = () => {
      savePdfFile(reader.result as string, file.name, 1, zoom).catch(e =>
        console.warn('Failed to save PDF to IndexedDB', e)
      );
    };
    reader.readAsDataURL(file);

    await renderPage(doc, 1, zoom);

    const thumbMap = new Map<number, string>();
    const batch = Math.min(doc.numPages, 20);
    for (let i = 1; i <= batch; i++) {
      const data = await renderThumbnail(doc, i);
      thumbMap.set(i, data);
      if (i % 5 === 0) setThumbnails(new Map(thumbMap));
    }
    setThumbnails(new Map(thumbMap));

    if (doc.numPages > batch) {
      (async () => {
        for (let i = batch + 1; i <= doc.numPages; i++) {
          const data = await renderThumbnail(doc, i);
          thumbMap.set(i, data);
          if (i % 10 === 0) setThumbnails(new Map(thumbMap));
        }
        setThumbnails(new Map(thumbMap));
      })();
    }
  };

  useEffect(() => {
    if (pdfDoc) renderPage(pdfDoc, currentPage, zoom);
  }, [currentPage, zoom, pdfDoc]);

  useEffect(() => {
    if (activeLanguage === 'english' || !showTranslation || !pdfDoc) return;
    const cacheKey = `${currentPage}-${activeLanguage}`;
    if (translatedText.has(cacheKey)) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);
    translateTimeoutRef.current = setTimeout(() => {
      handleLanguageSelect(activeLanguage, currentPage);
    }, 800);
    return () => {
      if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);
    };
  }, [currentPage, activeLanguage, showTranslation, pdfDoc]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const prefetchTranslations = useCallback(async (doc: pdfjsLib.PDFDocumentProxy, fromPage: number, lang: LangOption) => {
    if (prefetchAbortRef.current) prefetchAbortRef.current.abort();
    const controller = new AbortController();
    prefetchAbortRef.current = controller;
    for (let p = fromPage + 1; p <= Math.min(fromPage + 3, totalPages); p++) {
      if (controller.signal.aborted) return;
      const key = `${p}-${lang}`;
      if (translatedText.has(key)) continue;
      try {
        await new Promise(r => setTimeout(r, 500));
        if (controller.signal.aborted) return;
        const text = await extractSinglePageText(doc, p);
        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({ action: 'translate', pageText: text, language: lang }),
          signal: controller.signal,
        });
        if (resp.ok) {
          const data = await resp.json();
          setTranslatedText(prev => new Map(prev).set(key, data.translation));
        }
      } catch {}
    }
  }, [totalPages, translatedText]);

  const handleLanguageSelect = async (lang: LangOption, pageNum?: number) => {
    const targetPage = pageNum ?? currentPage;
    if (lang === 'english') { setShowTranslation(false); setActiveLanguage('english'); return; }
    const cacheKey = `${targetPage}-${lang}`;
    if (translatedText.has(cacheKey)) { setActiveLanguage(lang); setShowTranslation(true); setViewMode('split'); return; }
    if (!pdfDoc) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsTranslating(true); setTranslationProgress(0); setActiveLanguage(lang); setShowTranslation(true); setViewMode('split');
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setTranslationProgress(prev => {
        if (prev >= 90) { clearInterval(progressIntervalRef.current!); return 90; }
        const increment = prev < 30 ? 5 : prev < 60 ? 3 : 1;
        return Math.min(prev + increment, 90);
      });
    }, 300);
    try {
      const freshText = await extractSinglePageText(pdfDoc, targetPage);
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ action: 'translate', pageText: freshText, language: lang }),
        signal: controller.signal,
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Translation failed' }));
        toast.error(err.error || 'Translation failed');
        setIsTranslating(false); setTranslationProgress(0);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        return;
      }
      const data = await resp.json();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setTranslationProgress(100);
      setTranslatedText(prev => new Map(prev).set(cacheKey, data.translation));
      setTimeout(() => { setIsTranslating(false); setTranslationProgress(0); }, 400);
      prefetchTranslations(pdfDoc, targetPage, lang);
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      toast.error('Translation failed');
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsTranslating(false); setTranslationProgress(0);
    }
  };

  const handleQuiz = async () => {
    if (!pdfDoc) return;
    const from = Math.max(1, Math.min(quizFrom, totalPages));
    const to = Math.max(from, Math.min(quizTo, totalPages));
    if (to - from > 30) { toast.error('Max 30 pages at once'); return; }
    const finalCount = customQuizCount ? Math.min(Math.max(Number(customQuizCount), 1), 20) : quizCount;
    setQuizOpen(false); setIsLoadingQuiz(true);
    try {
      toast.info(`Extracting text from ${to - from + 1} page(s) for quiz...`);
      const combinedText = await extractTextFromPages(pdfDoc, from, to);
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ action: 'quiz', pageText: combinedText, language: activeLanguage, numQuestions: finalCount, questionTypes: Array.from(quizTypes) }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Quiz generation failed' }));
        toast.error(err.error || 'Quiz generation failed'); setIsLoadingQuiz(false); return;
      }
      const data = await resp.json();
      if (data.questions?.length) {
        if (!user) { toast.error('Please sign in to take quizzes'); setIsLoadingQuiz(false); return; }
        const autoName = `${fileName || 'PDF'} - Page ${quizFrom}${quizTo !== quizFrom ? `-${quizTo}` : ''}`;
        const { data: savedQuiz, error: saveError } = await supabase.from('pdf_saved_quizzes').insert({
          user_id: user.id,
          name: autoName,
          questions: data.questions,
          language: activeLanguage,
          pdf_name: fileName || null,
          page_range: quizFrom === quizTo ? `${quizFrom}` : `${quizFrom}-${quizTo}`,
        }).select('id').single();
        if (saveError || !savedQuiz) { toast.error('Failed to save quiz'); setIsLoadingQuiz(false); return; }
        navigate(`/quizzes/${savedQuiz.id}`);
      }
      else toast.error('No questions generated');
    } catch { toast.error('Quiz generation failed'); }
    setIsLoadingQuiz(false);
  };

  const handleTopBarSummarize = async () => {
    if (!pdfDoc) return;
    const from = Math.max(1, Math.min(sumFrom, totalPages));
    const to = Math.max(from, Math.min(sumTo, totalPages));
    if (to - from > 30) { toast.error('Max 30 pages at once'); return; }
    setSummarizeOpen(false); setIsSummarizing(true); setShowChat(true);
    try {
      toast.info(`Extracting text from ${to - from + 1} page(s)...`);
      const combinedText = await extractTextFromPages(pdfDoc, from, to);
      const prompt = from === to ? `Summarize page ${from} in bullet points` : `Summarize pages ${from}-${to} in bullet points`;
      if (triggerSummarizeRef.current) triggerSummarizeRef.current(combinedText, prompt);
    } catch { toast.error('Failed to extract text'); }
    setIsSummarizing(false);
  };

  useEffect(() => {
    return () => {
      if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (prefetchAbortRef.current) prefetchAbortRef.current.abort();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const translationCacheKey = `${currentPage}-${activeLanguage}`;
  const showSplitView = showTranslation && activeLanguage !== 'english' && viewMode === 'split' && translatedText.has(translationCacheKey);
  const showOverlayTranslation = showTranslation && activeLanguage !== 'english' && viewMode === 'overlay' && translatedText.has(translationCacheKey);

  if (!pdfDoc) {
    if (restoringPdf) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Restoring your PDF…</p>
        </div>
      );
    }
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold">PDF Reader</h2>
          <p className="text-muted-foreground max-w-md">
            Upload any PDF to read it with AI-powered summaries, auto-play mode, and page thumbnails.
          </p>
        </div>
        <Button size="lg" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" /> Open PDF
        </Button>
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="border-b border-border bg-card px-2 md:px-4 py-2 flex items-center gap-1.5 md:gap-2 overflow-x-auto">
        <Button variant="ghost" size="sm" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden md:inline ml-1">Back</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={async () => { clearPdfMemoryCache(); await clearPdfState(); setPdfDoc(null); setFileName(''); setTotalPages(0); setCurrentPage(1); setPageText(''); }} className="shrink-0 text-destructive hover:text-destructive" title="Close PDF">
          <X className="h-4 w-4" />
          <span className="hidden md:inline ml-1">Close</span>
        </Button>
        <span className="text-sm font-medium truncate max-w-[100px] md:max-w-[200px] hidden md:inline">{fileName}</span>
        <span className="text-xs text-muted-foreground shrink-0">
          {currentPage}/{totalPages}
        </span>

        <div className="flex items-center gap-1 ml-auto shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(3, z + 0.2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 h-8 shrink-0">
              <Languages className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{LANG_LABELS[activeLanguage]}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(LANG_LABELS) as LangOption[]).map(lang => (
              <DropdownMenuItem key={lang} onClick={() => handleLanguageSelect(lang)}>
                {LANG_LABELS[lang]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {showTranslation && activeLanguage !== 'english' && (
          <div className="flex items-center border rounded-md overflow-hidden h-8 shrink-0">
            <Button variant={viewMode === 'split' ? 'default' : 'ghost'} size="sm" className="h-full rounded-none px-2" onClick={() => setViewMode('split')}>
              <Columns2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant={viewMode === 'overlay' ? 'default' : 'ghost'} size="sm" className="h-full rounded-none px-2" onClick={() => setViewMode('overlay')}>
              <AlignJustify className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Summarize popover */}
        <Popover open={summarizeOpen} onOpenChange={setSummarizeOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 h-8 shrink-0" disabled={isSummarizing}>
              {isSummarizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span className="hidden md:inline">Summarize</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-3">
              <p className="text-sm font-medium">Summarize pages</p>
              <div className="flex items-center gap-2">
                <input type="number" min={1} max={totalPages} value={sumFrom} onChange={e => setSumFrom(Number(e.target.value))} className="w-16 h-8 rounded border bg-background text-center text-sm" />
                <span className="text-xs text-muted-foreground">to</span>
                <input type="number" min={1} max={totalPages} value={sumTo} onChange={e => setSumTo(Number(e.target.value))} className="w-16 h-8 rounded border bg-background text-center text-sm" />
              </div>
              <Button size="sm" className="w-full" onClick={handleTopBarSummarize}>Summarize</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Quiz popover */}
        <Popover open={quizOpen} onOpenChange={setQuizOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 h-8 shrink-0" disabled={isLoadingQuiz}>
              {isLoadingQuiz ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
              <span className="hidden md:inline">Quiz</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="end">
            <div className="space-y-3">
              <p className="text-sm font-medium">Generate quiz</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground shrink-0">Pages</span>
                <input type="number" min={1} max={totalPages} value={quizFrom} onChange={e => setQuizFrom(Number(e.target.value))} className="w-16 h-8 rounded border bg-background text-center text-sm" />
                <span className="text-xs text-muted-foreground">to</span>
                <input type="number" min={1} max={totalPages} value={quizTo} onChange={e => setQuizTo(Number(e.target.value))} className="w-16 h-8 rounded border bg-background text-center text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground shrink-0">Questions</span>
                <div className="flex gap-1">
                  {[3, 5, 10].map(n => (
                    <Button key={n} variant={quizCount === n && !customQuizCount ? 'default' : 'outline'} size="sm" className="h-7 px-2 text-xs" onClick={() => { setQuizCount(n); setCustomQuizCount(''); }}>
                      {n}
                    </Button>
                  ))}
                  <input type="number" min={1} max={20} placeholder="#" value={customQuizCount} onChange={e => setCustomQuizCount(e.target.value)} className="w-12 h-7 rounded border bg-background text-center text-xs" />
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Question types</span>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.entries(QUIZ_TYPE_LABELS) as [QuizType, string][]).map(([type, label]) => (
                    <label key={type} className="flex items-center gap-1 text-xs cursor-pointer">
                      <Checkbox checked={quizTypes.has(type)} onCheckedChange={() => toggleQuizType(type)} className="h-3.5 w-3.5" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <Button size="sm" className="w-full" onClick={handleQuiz}>Generate</Button>
            </div>
          </PopoverContent>
        </Popover>

        <PdfAutoPlay currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

        <Button variant={showChat ? 'default' : 'outline'} size="sm" className="gap-1 h-8 shrink-0" onClick={() => setShowChat(!showChat)}>
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Chat</span>
        </Button>
      </div>

      {/* Translation progress */}
      {isTranslating && (
        <div className="px-4 py-1.5 bg-primary/5 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-primary">
            <Loader2 className="h-3 w-3 animate-spin" />
            Translating to {LANG_LABELS[activeLanguage]}…
          </div>
          <Progress value={translationProgress} className="h-1 mt-1" />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Thumbnail sidebar - hidden on mobile */}
        <ScrollArea className="w-24 border-r border-border bg-card flex-shrink-0 hidden md:block">
          <div className="p-2 space-y-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-full rounded-md overflow-hidden border-2 transition-all ${currentPage === pageNum ? 'border-primary shadow-md' : 'border-transparent hover:border-muted-foreground/30'}`}
              >
                {thumbnails.has(pageNum) ? (
                  <img src={thumbnails.get(pageNum)} alt={`Page ${pageNum}`} className="w-full" />
                ) : (
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center text-xs text-muted-foreground">{pageNum}</div>
                )}
                <div className="text-[10px] text-center py-0.5 text-muted-foreground">{pageNum}</div>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* PDF canvas area */}
        <div className="flex-1 flex overflow-hidden" {...swipeHandlers}>
          <ScrollArea className={showSplitView ? 'w-1/2' : 'flex-1'}>
            <div className="p-2 md:p-4 flex justify-center relative">
              <canvas ref={mainCanvasRef} className="shadow-lg rounded-lg max-w-full" style={pageFoldStyle} />
              {showOverlayTranslation && (
                <div className="absolute inset-2 md:inset-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 md:p-6 overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-primary">{LANG_LABELS[activeLanguage]} Translation</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowTranslation(false)}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1" /> Original
                    </Button>
                  </div>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{translatedText.get(translationCacheKey) || ''}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {showSplitView && (
            <ScrollArea className="w-1/2 border-l border-border">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary">{LANG_LABELS[activeLanguage]} Translation</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowTranslation(false)}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1" /> Hide
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{translatedText.get(translationCacheKey) || ''}</ReactMarkdown>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Page navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2 bg-card/90 backdrop-blur border border-border rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-lg z-10">
          <Button variant="ghost" size="sm" className="h-7 px-2 md:px-3" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
            <span className="hidden md:inline">Prev</span>
            <span className="md:hidden text-xs">◀</span>
          </Button>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={e => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) handlePageChange(val);
            }}
            className="w-10 md:w-12 h-7 text-center text-sm bg-background border rounded"
          />
          <span className="text-xs text-muted-foreground">/ {totalPages}</span>
          <Button variant="ghost" size="sm" className="h-7 px-2 md:px-3" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
            <span className="hidden md:inline">Next</span>
            <span className="md:hidden text-xs">▶</span>
          </Button>
        </div>

        {/* Chat sidebar - Sheet on mobile, side panel on desktop */}
        {showChat && !isMobile && (
          <PdfChatSidebar
            pageText={pageText}
            currentPage={currentPage}
            totalPages={totalPages}
            pdfDoc={pdfDoc}
            onClose={() => setShowChat(false)}
          />
        )}
        {isMobile && (
          <Sheet open={showChat} onOpenChange={setShowChat}>
            <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col">
              <PdfChatSidebar
                pageText={pageText}
                currentPage={currentPage}
                totalPages={totalPages}
                pdfDoc={pdfDoc}
                onClose={() => setShowChat(false)}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

    </div>
  );
}
