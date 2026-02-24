import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Upload, ZoomIn, ZoomOut, MessageSquare, RotateCcw, Languages, Brain, Loader2, ChevronDown, Sparkles, Columns2, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PdfAutoPlay } from './PdfAutoPlay';
import { PdfChatSidebar } from './PdfChatSidebar';
import { PdfQuizPanel } from './PdfQuizPanel';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

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

/** Extract text from a single page directly from the doc (avoids stale state) */
async function extractSinglePageText(doc: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<string> {
  const page = await doc.getPage(pageNum);
  const content = await page.getTextContent();
  return content.items.map((item: any) => item.str).join(' ');
}

interface PdfReaderViewProps {
  onBack: () => void;
}

export function PdfReaderView({ onBack }: PdfReaderViewProps) {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.2);
  const [fileName, setFileName] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [pageText, setPageText] = useState('');
  const [thumbnails, setThumbnails] = useState<Map<number, string>>(new Map());
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  // Translation state — cache keyed by "page-lang"
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

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizFrom, setQuizFrom] = useState(1);
  const [quizTo, setQuizTo] = useState(1);
  const [quizCount, setQuizCount] = useState(5);
  const [customQuizCount, setCustomQuizCount] = useState('');
  const [quizTypes, setQuizTypes] = useState<Set<QuizType>>(new Set(['mcq', 'true_false', 'fill_blank', 'multiple_correct', 'short']));

  // Summarize popover state
  const [summarizeOpen, setSummarizeOpen] = useState(false);
  const [sumFrom, setSumFrom] = useState(1);
  const [sumTo, setSumTo] = useState(1);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const triggerSummarizeRef = useRef<((text: string, prompt: string) => void) | null>(null);

  const toggleQuizType = (type: QuizType) => {
    setQuizTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type); // keep at least one
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const renderPage = useCallback(async (doc: pdfjsLib.PDFDocumentProxy, pageNum: number, scale: number) => {
    if (!mainCanvasRef.current || isRendering) return;
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
    setIsRendering(false);
  }, [isRendering]);

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

  // Debounced auto-translate when page changes with non-English language active
  useEffect(() => {
    if (activeLanguage === 'english' || !showTranslation || !pdfDoc) return;
    const cacheKey = `${currentPage}-${activeLanguage}`;
    if (translatedText.has(cacheKey)) return;

    // Cancel any in-flight request
    if (abortControllerRef.current) abortControllerRef.current.abort();
    // Cancel any pending debounce
    if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);

    // Debounce 800ms
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

  // Prefetch next pages translation in background
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
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: 'translate', pageText: text, language: lang }),
          signal: controller.signal,
        });
        if (resp.ok) {
          const data = await resp.json();
          setTranslatedText(prev => new Map(prev).set(key, data.translation));
        }
      } catch {
        // silently fail prefetch
      }
    }
  }, [totalPages, translatedText]);

  // Translation handler — extracts text directly from pdfDoc to avoid stale state
  const handleLanguageSelect = async (lang: LangOption, pageNum?: number) => {
    const targetPage = pageNum ?? currentPage;

    if (lang === 'english') {
      setShowTranslation(false);
      setActiveLanguage('english');
      return;
    }

    const cacheKey = `${targetPage}-${lang}`;

    if (translatedText.has(cacheKey)) {
      setActiveLanguage(lang);
      setShowTranslation(true);
      setViewMode('split');
      return;
    }

    if (!pdfDoc) return;

    // Cancel previous in-flight
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsTranslating(true);
    setTranslationProgress(0);
    setActiveLanguage(lang);
    setShowTranslation(true);
    setViewMode('split');

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setTranslationProgress(prev => {
        if (prev >= 90) { clearInterval(progressIntervalRef.current!); return 90; }
        const increment = prev < 30 ? 5 : prev < 60 ? 3 : 1;
        return Math.min(prev + increment, 90);
      });
    }, 300);

    try {
      // Extract text directly from the doc for the target page
      const freshText = await extractSinglePageText(pdfDoc, targetPage);

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: 'translate', pageText: freshText, language: lang }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Translation failed' }));
        toast.error(err.error || 'Translation failed');
        setIsTranslating(false);
        setTranslationProgress(0);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        return;
      }

      const data = await resp.json();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setTranslationProgress(100);
      setTranslatedText(prev => new Map(prev).set(cacheKey, data.translation));
      setTimeout(() => {
        setIsTranslating(false);
        setTranslationProgress(0);
      }, 400);

      // Prefetch next pages in background
      prefetchTranslations(pdfDoc, targetPage, lang);
    } catch (e: any) {
      if (e?.name === 'AbortError') return; // cancelled, ignore
      toast.error('Translation failed');
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsTranslating(false);
      setTranslationProgress(0);
    }
  };

  // Quiz handler with page range, question count, and question types
  const handleQuiz = async () => {
    if (!pdfDoc) return;
    const from = Math.max(1, Math.min(quizFrom, totalPages));
    const to = Math.max(from, Math.min(quizTo, totalPages));

    if (to - from > 30) {
      toast.error('Max 30 pages at once');
      return;
    }

    const finalCount = customQuizCount ? Math.min(Math.max(Number(customQuizCount), 1), 20) : quizCount;

    setQuizOpen(false);
    setIsLoadingQuiz(true);
    try {
      toast.info(`Extracting text from ${to - from + 1} page(s) for quiz...`);
      const combinedText = await extractTextFromPages(pdfDoc, from, to);

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: 'quiz',
          pageText: combinedText,
          language: activeLanguage,
          numQuestions: finalCount,
          questionTypes: Array.from(quizTypes),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Quiz generation failed' }));
        toast.error(err.error || 'Quiz generation failed');
        setIsLoadingQuiz(false);
        return;
      }

      const data = await resp.json();
      if (data.questions?.length) {
        setQuizQuestions(data.questions);
        setShowQuiz(true);
      } else {
        toast.error('No questions generated');
      }
    } catch {
      toast.error('Quiz generation failed');
    }
    setIsLoadingQuiz(false);
  };

  // Top-bar summarize handler
  const handleTopBarSummarize = async () => {
    if (!pdfDoc) return;
    const from = Math.max(1, Math.min(sumFrom, totalPages));
    const to = Math.max(from, Math.min(sumTo, totalPages));

    if (to - from > 30) {
      toast.error('Max 30 pages at once');
      return;
    }

    setSummarizeOpen(false);
    setIsSummarizing(true);
    setShowChat(true);

    try {
      toast.info(`Extracting text from ${to - from + 1} page(s)...`);
      const combinedText = await extractTextFromPages(pdfDoc, from, to);
      const prompt = from === to
        ? `Summarize page ${from} in bullet points`
        : `Summarize pages ${from}-${to} in bullet points`;

      if (triggerSummarizeRef.current) {
        triggerSummarizeRef.current(combinedText, prompt);
      }
    } catch {
      toast.error('Failed to extract text');
    }
    setIsSummarizing(false);
  };

  // Cleanup on unmount
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
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold">PDF Reader</h2>
          <p className="text-muted-foreground max-w-md">
            Upload any PDF to read it with AI-powered summaries, auto-play mode, and page thumbnails.
            Your PDF stays in your browser — zero cloud storage cost.
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
      <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <span className="font-medium text-sm truncate flex-1 min-w-0">{fileName}</span>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.min(3, z + 0.2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(1.2)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Language dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={activeLanguage !== 'english' ? 'default' : 'outline'}
              size="sm"
              disabled={isTranslating}
              className="min-w-[110px]"
            >
              {isTranslating ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" /> ...</>
              ) : (
                <><Languages className="h-4 w-4 mr-1" /> {LANG_LABELS[activeLanguage]} <ChevronDown className="h-3 w-3 ml-1" /></>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => handleLanguageSelect('english')}>
              🇬🇧 English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageSelect('hindi')}>
              🇮🇳 हिंदी (Hindi)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageSelect('hinglish')}>
              🔀 Hinglish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Split / Overlay toggle */}
        {showTranslation && activeLanguage !== 'english' && (
          <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
            <Button
              variant={viewMode === 'split' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode('split')}
              title="Side-by-side view"
            >
              <Columns2 className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Split</span>
            </Button>
            <Button
              variant={viewMode === 'overlay' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode('overlay')}
              title="Single column view"
            >
              <AlignJustify className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Full</span>
            </Button>
          </div>
        )}

        {/* Summarize button with popover */}
        <Popover open={summarizeOpen} onOpenChange={(open) => {
          setSummarizeOpen(open);
          if (open) {
            setSumFrom(currentPage);
            setSumTo(Math.min(currentPage + 4, totalPages));
          }
        }}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" disabled={isSummarizing}>
              {isSummarizing ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" /> ...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-1" /> Summarize</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-3">
            <p className="text-sm font-semibold mb-3">Summarize page range</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground whitespace-nowrap">From</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={sumFrom}
                onChange={(e) => setSumFrom(Number(e.target.value))}
                className="w-16 bg-background border border-border rounded px-2 py-1 text-xs text-center outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={sumTo}
                onChange={(e) => setSumTo(Number(e.target.value))}
                className="w-16 bg-background border border-border rounded px-2 py-1 text-xs text-center outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Max 30 pages. Opens AI Chat with the summary.
            </p>
            <Button className="w-full" size="sm" onClick={handleTopBarSummarize} disabled={isSummarizing}>
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Go
            </Button>
          </PopoverContent>
        </Popover>

        {/* Quiz Me with popover config */}
        <Popover open={quizOpen} onOpenChange={(open) => {
          setQuizOpen(open);
          if (open) {
            setQuizFrom(currentPage);
            setQuizTo(Math.min(currentPage + 4, totalPages));
            setQuizCount(5);
            setCustomQuizCount('');
          }
        }}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoadingQuiz}>
              {isLoadingQuiz ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" /> ...</>
              ) : (
                <><Brain className="h-4 w-4 mr-1" /> Quiz Me</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-3">
            <p className="text-sm font-semibold mb-3">Quiz Settings</p>
            <div className="space-y-3">
              {/* Page range */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Pages</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={quizFrom}
                  onChange={(e) => setQuizFrom(Number(e.target.value))}
                  className="w-14 bg-background border border-border rounded px-2 py-1 text-xs text-center outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={quizTo}
                  onChange={(e) => setQuizTo(Number(e.target.value))}
                  className="w-14 bg-background border border-border rounded px-2 py-1 text-xs text-center outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Question count */}
              <div>
                <span className="text-xs text-muted-foreground mb-1.5 block">Questions</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[3, 5, 8, 10].map((n) => (
                    <Button
                      key={n}
                      size="sm"
                      variant={!customQuizCount && quizCount === n ? 'default' : 'outline'}
                      className="h-7 px-2.5 text-xs"
                      onClick={() => { setQuizCount(n); setCustomQuizCount(''); }}
                    >
                      {n}
                    </Button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    max={20}
                    placeholder="Custom"
                    value={customQuizCount}
                    onChange={(e) => setCustomQuizCount(e.target.value)}
                    className="w-16 bg-background border border-border rounded px-2 py-1 text-xs text-center outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Question types */}
              <div>
                <span className="text-xs text-muted-foreground mb-1.5 block">Question Types</span>
                <div className="space-y-1.5">
                  {(Object.keys(QUIZ_TYPE_LABELS) as QuizType[]).map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={quizTypes.has(type)}
                        onCheckedChange={() => toggleQuizType(type)}
                      />
                      <Label className="text-xs cursor-pointer font-normal">{QUIZ_TYPE_LABELS[type]}</Label>
                    </label>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">Max 30 pages, 1-20 questions.</p>
              <Button className="w-full" size="sm" onClick={handleQuiz} disabled={isLoadingQuiz}>
                <Brain className="h-3.5 w-3.5 mr-1" /> Generate Quiz
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button variant={showChat ? 'secondary' : 'outline'} size="sm" onClick={() => setShowChat(!showChat)}>
          <MessageSquare className="h-4 w-4 mr-1" /> AI Chat
        </Button>

        <Button variant="outline" size="sm" onClick={() => { setPdfDoc(null); setFileName(''); }}>
          New PDF
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnail sidebar */}
        <ScrollArea className="w-28 border-r border-border bg-muted/30 flex-shrink-0">
          <div className="p-2 space-y-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-full rounded-md overflow-hidden border-2 transition-all ${
                  currentPage === pageNum ? 'border-primary ring-1 ring-primary' : 'border-transparent hover:border-muted-foreground/30'
                }`}
              >
                {thumbnails.get(pageNum) ? (
                  <img src={thumbnails.get(pageNum)} alt={`Page ${pageNum}`} className="w-full" />
                ) : (
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">{pageNum}</span>
                  </div>
                )}
                <div className="text-[10px] text-center py-0.5 text-muted-foreground">{pageNum}</div>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Main page view */}
        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className={`border-r border-border transition-all flex-1 ${showOverlayTranslation ? 'hidden' : ''}`}>
            <div className="flex flex-col items-center p-4 min-h-full overflow-auto">
              {showSplitView && (
                <div className="mb-2 flex items-center gap-1.5 self-start ml-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    🇬🇧 Original
                  </span>
                </div>
              )}
              <canvas ref={mainCanvasRef} className="shadow-lg rounded-sm max-w-full h-auto" />
            </div>
          </ScrollArea>

          {showOverlayTranslation && (
            <ScrollArea className="flex-1">
              <div className="flex items-start justify-center p-4 min-h-full">
                <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <Languages className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm">
                      {activeLanguage === 'hindi' ? '🇮🇳 हिंदी अनुवाद' : '🔀 Hinglish'} — Page {currentPage}
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{translatedText.get(translationCacheKey)!}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          {showSplitView && (
            <ScrollArea className="flex-1">
              <div className="flex flex-col p-4 min-h-full">
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {activeLanguage === 'hindi' ? '🇮🇳 हिंदी' : '🔀 Hinglish'} — Page {currentPage}
                  </span>
                </div>
                <div className="bg-card border border-border rounded-lg shadow p-5">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{translatedText.get(translationCacheKey)!}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          {isTranslating && activeLanguage !== 'english' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-xs w-full px-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Languages className="h-7 w-7 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">
                    {activeLanguage === 'hindi' ? 'हिंदी में बदल रहे हैं...' : 'Converting to Hinglish...'}
                  </p>
                  <p className="text-xs text-muted-foreground">Page {currentPage}</p>
                </div>
                <div className="space-y-1.5">
                  <Progress value={translationProgress} className="h-2.5" />
                  <p className="text-xs font-medium text-primary">{translationProgress}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {showChat && (
          <PdfChatSidebar
            pageText={pageText}
            currentPage={currentPage}
            totalPages={totalPages}
            pdfDoc={pdfDoc}
            onClose={() => setShowChat(false)}
            onTranslate={() => {
              if (triggerSummarizeRef.current) {
                triggerSummarizeRef.current(pageText, 'इस पेज को हिंदी में समझाओ (Explain this page in Hindi in detail)');
              }
            }}
            onQuiz={handleQuiz}
            onRegisterTrigger={(fn) => { triggerSummarizeRef.current = fn; }}
          />
        )}
      </div>

      <PdfAutoPlay currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {showQuiz && quizQuestions.length > 0 && (
        <PdfQuizPanel
          questions={quizQuestions}
          currentPage={currentPage}
          pageRange={{ from: quizFrom, to: quizTo }}
          language={activeLanguage}
          pageText={pageText}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}
