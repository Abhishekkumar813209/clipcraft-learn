import { useState, useCallback, useRef, useEffect } from 'react';
import { Camera, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoScreenshotFrameProps {
  onCapture: () => void;
}

type HandleDirection = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

const MIN_SIZE = 60;

export function VideoScreenshotFrame({ onCapture }: VideoScreenshotFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({ x: 40, y: 40, w: 200, h: 140 });
  const dragRef = useRef<{ type: 'move' | HandleDirection; startX: number; startY: number; startRect: typeof rect; pointerId: number } | null>(null);

  const handlePointerDown = useCallback((type: 'move' | HandleDirection, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { type, startX: e.clientX, startY: e.clientY, startRect: { ...rect }, pointerId: e.pointerId };
  }, [rect]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const s = d.startRect;

    if (d.type === 'move') {
      setRect({ ...s, x: Math.max(0, s.x + dx), y: Math.max(0, s.y + dy) });
      return;
    }

    let { x, y, w, h } = s;
    if (d.type.includes('e')) w = Math.max(MIN_SIZE, s.w + dx);
    if (d.type.includes('w')) { w = Math.max(MIN_SIZE, s.w - dx); x = s.x + s.w - w; }
    if (d.type.includes('s')) h = Math.max(MIN_SIZE, s.h + dy);
    if (d.type.includes('n')) { h = Math.max(MIN_SIZE, s.h - dy); y = s.y + s.h - h; }
    setRect({ x: Math.max(0, x), y: Math.max(0, y), w, h });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handles: { dir: HandleDirection; cursor: string; style: React.CSSProperties }[] = [
    { dir: 'nw', cursor: 'nwse-resize', style: { top: -4, left: -4 } },
    { dir: 'n', cursor: 'ns-resize', style: { top: -4, left: '50%', transform: 'translateX(-50%)' } },
    { dir: 'ne', cursor: 'nesw-resize', style: { top: -4, right: -4 } },
    { dir: 'e', cursor: 'ew-resize', style: { top: '50%', right: -4, transform: 'translateY(-50%)' } },
    { dir: 'se', cursor: 'nwse-resize', style: { bottom: -4, right: -4 } },
    { dir: 's', cursor: 'ns-resize', style: { bottom: -4, left: '50%', transform: 'translateX(-50%)' } },
    { dir: 'sw', cursor: 'nesw-resize', style: { bottom: -4, left: -4 } },
    { dir: 'w', cursor: 'ew-resize', style: { top: '50%', left: -4, transform: 'translateY(-50%)' } },
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-none">
      <div
        className="absolute border-2 border-primary rounded-md pointer-events-auto bg-primary/5"
        style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Drag area */}
        <div
          className="absolute inset-0 cursor-move flex items-center justify-center"
          onPointerDown={(e) => handlePointerDown('move', e)}
        >
          <Move className="w-5 h-5 text-primary/40" />
        </div>

        {/* 8 resize handles */}
        {handles.map(({ dir, cursor, style }) => (
          <div
            key={dir}
            className="absolute w-3 h-3 bg-primary rounded-full border border-primary-foreground"
            style={{ ...style, cursor, position: 'absolute' }}
            onPointerDown={(e) => handlePointerDown(dir, e)}
          />
        ))}

        {/* Capture button */}
        <Button
          size="sm"
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 gap-1.5 text-xs shadow-lg whitespace-nowrap"
          onClick={(e) => { e.stopPropagation(); onCapture(); }}
        >
          <Camera className="w-3.5 h-3.5" />
          Ask AI about this
        </Button>
      </div>
    </div>
  );
}
