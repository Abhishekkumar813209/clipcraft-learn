import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Upload, ZoomIn, ZoomOut, MessageSquare, RotateCcw, Languages, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PdfAutoPlay } from './PdfAutoPlay';
import { PdfChatSidebar } from './PdfChatSidebar';
import { PdfQuizPanel } from './PdfQuizPanel';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-chat`;

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

  // Translation state
  const [translatedText, setTranslatedText] = useState<Map<number, string>>(new Map());
  const [showTranslation, setShowTranslation] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'english' | 'hindi'>('english');

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

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

  // When page changes, switch back to English if no cached translation
  useEffect(() => {
    if (showTranslation && !translatedText.has(currentPage)) {
      setShowTranslation(false);
      setActiveLanguage('english');
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Translation handler
  const handleTranslateToggle = async () => {
    if (showTranslation) {
      setShowTranslation(false);
      setActiveLanguage('english');
      return;
    }

    // Check cache
    if (translatedText.has(currentPage)) {
      setShowTranslation(true);
      setActiveLanguage('hindi');
      return;
    }

    setIsTranslating(true);
    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: 'translate', pageText }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Translation failed' }));
        toast.error(err.error || 'Translation failed');
        setIsTranslating(false);
        return;
      }

      const data = await resp.json();
      setTranslatedText(prev => new Map(prev).set(currentPage, data.translation));
      setShowTranslation(true);
      setActiveLanguage('hindi');
    } catch {
      toast.error('Translation failed');
    }
    setIsTranslating(false);
  };

  // Quiz handler
  const handleQuiz = async () => {
    setIsLoadingQuiz(true);
    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: 'quiz', pageText, language: activeLanguage }),
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
      <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <span className="font-medium text-sm truncate flex-1">{fileName}</span>
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

        {/* Hindi toggle */}
        <Button
          variant={showTranslation ? 'default' : 'outline'}
          size="sm"
          onClick={handleTranslateToggle}
          disabled={isTranslating}
          className="min-w-[80px]"
        >
          {isTranslating ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-1" /> ...</>
          ) : (
            <><Languages className="h-4 w-4 mr-1" /> {showTranslation ? 'English' : 'हिंदी'}</>
          )}
        </Button>

        {/* Quiz Me */}
        <Button variant="outline" size="sm" onClick={handleQuiz} disabled={isLoadingQuiz}>
          {isLoadingQuiz ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-1" /> ...</>
          ) : (
            <><Brain className="h-4 w-4 mr-1" /> Quiz Me</>
          )}
        </Button>

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
        <ScrollArea className="flex-1">
          <div className="flex items-start justify-center p-4 min-h-full">
            {showTranslation && translatedText.has(currentPage) ? (
              <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <Languages className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-sm">हिंदी अनुवाद — पृष्ठ {currentPage}</span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{translatedText.get(currentPage)!}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <canvas ref={mainCanvasRef} className="shadow-lg rounded-sm" />
            )}
          </div>
        </ScrollArea>

        {/* AI Chat sidebar */}
        {showChat && (
          <PdfChatSidebar
            pageText={pageText}
            currentPage={currentPage}
            totalPages={totalPages}
            pdfDoc={pdfDoc}
            onClose={() => setShowChat(false)}
            onTranslate={handleTranslateToggle}
            onQuiz={handleQuiz}
          />
        )}
      </div>

      {/* Bottom auto-play controls */}
      <PdfAutoPlay currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Quiz modal */}
      {showQuiz && quizQuestions.length > 0 && (
        <PdfQuizPanel
          questions={quizQuestions}
          currentPage={currentPage}
          language={activeLanguage}
          pageText={pageText}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}
