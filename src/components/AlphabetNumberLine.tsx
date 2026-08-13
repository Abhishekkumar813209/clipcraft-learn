import { useEffect, useRef, useState } from 'react';

const MIN_N = -1000;
const MAX_N = 1000;
const BASE_PX = 42;
const MIN_ZOOM = 0.08;
const MAX_ZOOM = 3;

export const letterOf = (n: number) => String.fromCharCode(65 + (((n - 1) % 26) + 26) % 26);

interface Props {
  /** 'ltr' = numbers badhte hue right ki taraf, 'rtl' = numbers badhte hue left ki taraf */
  dir: 'ltr' | 'rtl';
  title: string;
  subtitle: string;
}

export default function AlphabetNumberLine({ dir, title, subtitle }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState(40);
  const [width, setWidth] = useState(800);
  const state = useRef({ zoom, offset, width });
  state.current = { zoom, offset, width };

  const sign = dir === 'ltr' ? 1 : -1;
  const px = BASE_PX * zoom;
  const xOf = (n: number) => offset + sign * n * px;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // reset: 1..26 visible
  const reset = () => {
    const w = wrapRef.current?.clientWidth || 800;
    const z = Math.min(2, (w - 60) / (26 * BASE_PX));
    setZoom(z);
    setOffset(dir === 'ltr' ? 30 - BASE_PX * z : w - 30 + BASE_PX * z);
  };
  useEffect(reset, [dir]);

  // wheel zoom (non-passive)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { zoom: z, offset: o } = state.current;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * Math.exp(-dy * 0.0015)));
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const k = next / z;
      setZoom(next);
      setOffset(cx - (cx - o) * k);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // drag pan
  const drag = useRef<{ x: number; o: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, o: offset };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setOffset(drag.current.o + (e.clientX - drag.current.x));
  };
  const onUp = () => { drag.current = null; };

  // visible integers
  const nAt = (x: number) => (x - offset) / (sign * px);
  const a = nAt(dir === 'ltr' ? -60 : width + 60);
  const b = nAt(dir === 'ltr' ? width + 60 : -60);
  const start = Math.max(MIN_N, Math.floor(Math.min(a, b)));
  const end = Math.min(MAX_N, Math.ceil(Math.max(a, b)));
  const step = px < 14 ? Math.ceil(14 / px) : 1;
  const ticks: number[] = [];
  for (let n = start; n <= end; n += step) ticks.push(n);

  return (
    <div className="rounded-xl border border-emerald-100 bg-white/80 overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-emerald-100 bg-emerald-50/60">
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-xs rounded border border-emerald-200 bg-white" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z / 1.4))}>−</button>
          <button className="px-2 py-1 text-xs rounded border border-emerald-200 bg-white" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z * 1.4))}>+</button>
          <button className="px-2 py-1 text-xs rounded border border-emerald-200 bg-white" onClick={reset}>Reset</button>
        </div>
      </div>
      <div
        ref={wrapRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative h-32 cursor-grab active:cursor-grabbing select-none touch-none bg-gradient-to-b from-white to-emerald-50/40"
      >
        <div className="absolute left-0 right-0 top-1/2 h-px bg-emerald-300" />
        {ticks.map((n) => {
          const x = xOf(n);
          const major = n % 26 === 1 || n === 0;
          return (
            <div key={n} className="absolute top-0 h-full" style={{ left: x, transform: 'translateX(-50%)' }}>
              <div className="flex flex-col items-center h-full justify-center gap-1">
                <span className={`text-[11px] tabular-nums ${major ? 'font-bold text-emerald-700' : 'text-slate-500'}`}>{n}</span>
                <div className={`w-px ${major ? 'h-4 bg-emerald-500' : 'h-2.5 bg-slate-300'}`} />
                <span className={`text-sm font-bold ${major ? 'text-emerald-700' : 'text-slate-800'}`}>{letterOf(n)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-4 py-2 text-[11px] text-muted-foreground border-t border-emerald-100">
        Drag karke −1000 se 1000 tak jao · scroll / pinch se zoom · 27 = A, 0 = Z, −1 = Y
      </div>
    </div>
  );
}
