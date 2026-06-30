import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type * as pdfjsLib from 'pdfjs-dist';

type PDFDoc = Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>;

interface Props {
  pdfDoc: PDFDoc | null;
  pageCount: number;
  startPage: number;
  endPage: number;
  onChange: (start: number, end: number) => void;
  scannedPages?: Set<number>;
  ocrDonePages?: Set<number>;
}

const THUMB_WIDTH = 140;
const THUMB_SCALE = 0.35;
const BATCH_SIZE = 3;

export default function PdfPagePicker({ pdfDoc, pageCount, startPage, endPage, onChange }: Props) {
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  const [renderingPage, setRenderingPage] = useState<number | null>(null);
  const [pickPhase, setPickPhase] = useState<'start' | 'end'>('start');
  const [preview, setPreview] = useState<{ pageNum: number; url: string } | null>(null);
  const cancelRef = useRef(false);

  // Render thumbnails sequentially in background
  useEffect(() => {
    if (!pdfDoc) return;
    cancelRef.current = false;
    setThumbs({});

    (async () => {
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        if (cancelRef.current) return;
        try {
          setRenderingPage(i);
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: THUMB_SCALE });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          if (cancelRef.current) return;
          setThumbs((prev) => ({ ...prev, [i]: dataUrl }));
        } catch (e) {
          console.warn('thumb render fail', i, e);
        }
      }
      setRenderingPage(null);
    })();

    return () => {
      cancelRef.current = true;
    };
  }, [pdfDoc]);

  function handleClick(pageNum: number) {
    if (pickPhase === 'start') {
      onChange(pageNum, pageNum);
      setPickPhase('end');
    } else {
      const s = Math.min(startPage, pageNum);
      const e = Math.max(startPage, pageNum);
      onChange(s, e);
      setPickPhase('start');
    }
  }

  async function openPreview(pageNum: number) {
    if (!pdfDoc) return;
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport }).promise;
      setPreview({ pageNum, url: canvas.toDataURL('image/jpeg', 0.85) });
    } catch (e) {
      console.warn('preview fail', e);
    }
  }

  function reset() {
    onChange(1, pageCount);
    setPickPhase('start');
  }

  const selectedCount = endPage >= startPage ? endPage - startPage + 1 : 0;
  const batches = Math.ceil(selectedCount / BATCH_SIZE);
  const heavy = selectedCount > 60;

  if (!pdfDoc) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3 p-3 rounded-md bg-muted/40 border">
        <div>
          <label className="text-xs text-muted-foreground block">Start page</label>
          <Input
            type="number"
            min={1}
            max={pageCount}
            value={startPage}
            onChange={(e) => {
              const v = Math.max(1, Math.min(pageCount, parseInt(e.target.value) || 1));
              onChange(v, Math.max(v, endPage));
            }}
            className="w-24"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block">End page</label>
          <Input
            type="number"
            min={1}
            max={pageCount}
            value={endPage}
            onChange={(e) => {
              const v = Math.max(1, Math.min(pageCount, parseInt(e.target.value) || pageCount));
              onChange(Math.min(startPage, v), v);
            }}
            className="w-24"
          />
        </div>
        <div className="flex-1 min-w-[180px] text-sm">
          <div className="font-medium">
            {selectedCount > 0
              ? `Pages ${startPage} → ${endPage} selected`
              : 'No range selected'}
          </div>
          <div className="text-xs text-muted-foreground">
            {selectedCount} pages · ~{batches} AI batches
            {heavy && <span className="text-amber-600 dark:text-amber-400"> · heavy quota usage</span>}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="w-3 h-3 mr-1" />Reset
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        {pickPhase === 'start'
          ? 'Click a thumbnail to set the start page'
          : 'Click another thumbnail to set the end page'}
        · Double-click for full preview
        {renderingPage && (
          <span className="ml-2 inline-flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> rendering {renderingPage}/{pageCount}
          </span>
        )}
      </div>

      <div
        className="grid gap-2 max-h-[420px] overflow-y-auto p-2 rounded-md border bg-background"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${THUMB_WIDTH}px, 1fr))` }}
      >
        {Array.from({ length: pageCount }, (_, idx) => {
          const pageNum = idx + 1;
          const inRange = pageNum >= startPage && pageNum <= endPage && selectedCount > 0;
          const isEdge = pageNum === startPage || pageNum === endPage;
          const url = thumbs[pageNum];
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => handleClick(pageNum)}
              onDoubleClick={() => openPreview(pageNum)}
              className={cn(
                'group relative rounded-md overflow-hidden border-2 transition-all',
                'hover:border-primary/60 hover:shadow-md',
                inRange
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card',
                isEdge && 'ring-2 ring-primary ring-offset-1',
              )}
              style={{ aspectRatio: '0.77' }}
            >
              {url ? (
                <img
                  src={url}
                  alt={`Page ${pageNum}`}
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/40">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 text-[10px] text-center py-0.5 bg-background/85 backdrop-blur-sm font-medium">
                {pageNum}
                {pageNum === startPage && selectedCount > 0 && <span className="text-primary"> · S</span>}
                {pageNum === endPage && selectedCount > 0 && pageNum !== startPage && <span className="text-primary"> · E</span>}
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          {preview && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Page {preview.pageNum}</div>
              <img
                src={preview.url}
                alt={`Page ${preview.pageNum}`}
                className="w-full max-h-[75vh] object-contain bg-white rounded"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
