import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface PdfAutoPlayProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const INTERVALS = [
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
];

export function PdfAutoPlay({ currentPage, totalPages, onPageChange }: PdfAutoPlayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [interval, setIntervalSec] = useState(10);
  const [elapsed, setElapsed] = useState(0);

  const goNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      setElapsed(0);
    } else {
      setIsPlaying(false);
    }
  }, [currentPage, totalPages, onPageChange]);

  const goPrev = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      setElapsed(0);
    }
  }, [currentPage, onPageChange]);

  useEffect(() => {
    if (!isPlaying) return;
    const tick = globalThis.setInterval(() => {
      setElapsed((prev) => {
        if (prev + 0.1 >= interval) {
          goNext();
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);
    return () => globalThis.clearInterval(tick);
  }, [isPlaying, interval, goNext]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying((p) => !p); }
      if (e.code === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.code === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  const stop = () => { setIsPlaying(false); setElapsed(0); };
  const progress = (elapsed / interval) * 100;

  return (
    <div className="border-t border-border bg-card px-4 py-2.5 flex items-center gap-3">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Page {currentPage} / {totalPages}
      </span>

      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goPrev} disabled={currentPage <= 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goNext} disabled={currentPage >= totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="w-px h-5 bg-border" />

      <Select value={String(interval)} onValueChange={(v) => setIntervalSec(Number(v))}>
        <SelectTrigger className="w-20 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {INTERVALS.map((i) => (
            <SelectItem key={i.value} value={String(i.value)}>{i.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant={isPlaying ? 'secondary' : 'default'} size="sm" className="h-8" onClick={() => setIsPlaying((p) => !p)}>
        {isPlaying ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
        {isPlaying ? 'Pause' : 'Play'}
      </Button>

      {isPlaying && (
        <Button variant="ghost" size="sm" className="h-8" onClick={stop}>
          <Square className="h-3.5 w-3.5 mr-1" /> Stop
        </Button>
      )}

      {isPlaying && (
        <div className="flex-1 max-w-48">
          <Progress value={progress} className="h-1.5" />
        </div>
      )}
    </div>
  );
}
