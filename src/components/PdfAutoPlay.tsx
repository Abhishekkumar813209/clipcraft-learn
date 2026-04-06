import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface PdfAutoPlayProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCountdownChange?: (seconds: number | null) => void;
}

const INTERVALS = [
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: 'Custom', value: -1 },
];

export function PdfAutoPlay({ currentPage, totalPages, onPageChange, onCountdownChange }: PdfAutoPlayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalSec, setIntervalSec] = useState(10);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [progress, setProgress] = useState(0);

  const elapsedRef = useRef(0);
  const activeInterval = isCustom ? (Number(customValue) || 10) : intervalSec;

  const goNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentPage, totalPages, onPageChange]);

  const goPrev = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  const goPrevRef = useRef(goPrev);
  goPrevRef.current = goPrev;

  // Reset elapsed when page changes (new page = fresh timer)
  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(0);
  }, [currentPage]);

  // Stable timer — only depends on isPlaying and activeInterval
  useEffect(() => {
    if (!isPlaying) return;
    elapsedRef.current = 0;
    setProgress(0);

    const tick = setInterval(() => {
      elapsedRef.current += 0.1;
      const pct = (elapsedRef.current / activeInterval) * 100;
      setProgress(pct);
      const remaining = Math.ceil(activeInterval - elapsedRef.current);
      onCountdownChange?.(remaining);

      if (elapsedRef.current >= activeInterval) {
        elapsedRef.current = 0;
        goNextRef.current();
      }
    }, 100);

    return () => clearInterval(tick);
  }, [isPlaying, activeInterval]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying((p) => !p); }
      if (e.code === 'ArrowRight') { e.preventDefault(); goNextRef.current(); }
      if (e.code === 'ArrowLeft') { e.preventDefault(); goPrevRef.current(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const stop = () => { setIsPlaying(false); elapsedRef.current = 0; setProgress(0); onCountdownChange?.(null); };

  // Clear countdown when paused
  useEffect(() => {
    if (!isPlaying) onCountdownChange?.(null);
  }, [isPlaying, onCountdownChange]);

  const handleSelectChange = (v: string) => {
    const num = Number(v);
    if (num === -1) {
      setIsCustom(true);
      setCustomValue('');
    } else {
      setIsCustom(false);
      setIntervalSec(num);
    }
  };

  return (
    <div className="border-t border-border bg-card px-4 py-2.5 flex items-center gap-3">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Page {currentPage} / {totalPages}
      </span>

      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goPrevRef.current()} disabled={currentPage <= 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goNextRef.current()} disabled={currentPage >= totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="w-px h-5 bg-border" />

      <Select value={isCustom ? '-1' : String(intervalSec)} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-24 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {INTERVALS.map((i) => (
            <SelectItem key={i.value} value={String(i.value)}>{i.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isCustom && (
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={1}
            max={300}
            placeholder="sec"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="w-16 bg-background border border-border rounded px-2 py-1 text-xs text-center outline-none focus:ring-1 focus:ring-primary h-8"
          />
          <span className="text-xs text-muted-foreground">s</span>
        </div>
      )}

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
