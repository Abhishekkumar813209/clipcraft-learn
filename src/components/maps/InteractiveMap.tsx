import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { geoMercator, geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import { Loader2, Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type MapKind = 'india-political' | 'world-political' | 'india-rivers';

interface Feat {
  type: 'Feature';
  properties: { name: string; parent?: string | null; system?: string };
  geometry: GeoPermissibleObjects;
}

const SRC: Record<MapKind, string> = {
  'india-political': '/maps/india-states.geojson',
  'world-political': '/maps/world-countries.geojson',
  'india-rivers': '/maps/india-rivers.geojson',
};

const SYSTEM_COLORS: Record<string, string> = {
  Ganges: '#2563eb',
  Indus: '#7c3aed',
  Brahmaputra: '#0891b2',
  Godavari: '#d97706',
  Krishna: '#db2777',
  Mahanadi: '#16a34a',
  Cauvery: '#dc2626',
  Narmada: '#0d9488',
  Tapi: '#ca8a04',
  Mahi: '#9333ea',
  Penner: '#e11d48',
  Palar: '#4f46e5',
  Brahmani: '#059669',
};
const systemColor = (s?: string) => (s && SYSTEM_COLORS[s]) || '#1d4ed8';

const W = 900;
const H = 620;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function InteractiveMap({ kind }: { kind: MapKind }) {
  const [features, setFeatures] = useState<Feat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);

  const isRivers = kind === 'india-rivers';

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setSelected(null);
    setView({ k: 1, x: 0, y: 0 });
    fetch(SRC[kind])
      .then((r) => r.json())
      .then((d) => { if (alive) { setFeatures(d.features as Feat[]); setLoading(false); } })
      .catch(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [kind]);

  const path = useMemo(() => {
    if (!features.length) return null;
    const collection = { type: 'FeatureCollection', features } as unknown as GeoPermissibleObjects;
    const projection = kind === 'world-political' ? geoNaturalEarth1() : geoMercator();
    projection.fitExtent([[12, 12], [W - 12, H - 12]], collection);
    return geoPath(projection);
  }, [features, kind]);

  const shapes = useMemo(() => {
    if (!path) return [];
    return features
      .map((f) => ({ name: f.properties.name, parent: f.properties.parent ?? null, system: f.properties.system, d: path(f.geometry as never) || '' }))
      .filter((s) => s.d);
  }, [features, path]);

  const selectedShape = shapes.find((s) => s.name === selected);
  const childrenOf = (name: string) => shapes.filter((s) => s.parent === name);

  const isLit = (s: { name: string; parent: string | null }) => {
    if (!selected) return false;
    if (s.name === selected) return true;
    if (!isRivers) return false;
    // selecting a main river lights the whole system (its tributaries too)
    return !selectedShape?.parent && s.parent === selected;
  };

  const litColor = (s: { system?: string; parent: string | null }) =>
    systemColor(selectedShape?.parent ? selectedShape.system : s.system);

  const zoomBy = useCallback((factor: number, px = W / 2, py = H / 2) => {
    setView((v) => {
      const k = clamp(v.k * factor, 1, 14);
      const r = k / v.k;
      return { k, x: px - (px - v.x) * r, y: py - (py - v.y) * r };
    });
  }, []);

  const wheelRef = useRef(zoomBy);
  wheelRef.current = zoomBy;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * W;
      const py = ((e.clientY - rect.top) / rect.height) * H;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      wheelRef.current(Math.exp(-dy * 0.0015), px, py);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: view.x, oy: view.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = ((e.clientX - d.x) / rect.width) * W;
    const dy = ((e.clientY - d.y) / rect.height) * H;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setView((v) => ({ ...v, x: d.ox + dx, y: d.oy + dy }));
  };
  const endDrag = () => { setTimeout(() => { drag.current = null; }, 0); };
  const pick = (name: string) => { if (!drag.current?.moved) setSelected((s) => (s === name ? null : name)); };

  const labelPoint = selectedShape && path
    ? path.centroid((features.find((f) => f.properties.name === selected)?.geometry) as never)
    : null;

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-sky-50 to-white overflow-hidden shadow-sm touch-none select-none"
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-sm text-slate-600">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Map load ho raha hai…
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          <Button size="icon" variant="secondary" className="h-8 w-8 shadow" onClick={() => zoomBy(1.4)}><Plus className="w-4 h-4" /></Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 shadow" onClick={() => zoomBy(1 / 1.4)}><Minus className="w-4 h-4" /></Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 shadow" onClick={() => { setView({ k: 1, x: 0, y: 0 }); setSelected(null); }}><RotateCcw className="w-4 h-4" /></Button>
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            {isRivers && (
              <path
                d={path ? '' : ''}
                fill="none"
              />
            )}
            {shapes.map((s) => {
              const lit = isLit(s);
              const hot = hovered === s.name;
              if (isRivers) {
                return (
                  <g key={s.name}>
                    <path
                      d={s.d}
                      fill="none"
                      stroke={lit ? litColor(s) : hot ? '#64748b' : '#94a3b8'}
                      strokeWidth={lit ? 3.2 : hot ? 2.2 : 1.2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="transition-[stroke,stroke-width] duration-150"
                    />
                    <path
                      d={s.d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={12}
                      vectorEffect="non-scaling-stroke"
                      className="cursor-pointer"
                      onClick={() => pick(s.name)}
                      onMouseEnter={() => setHovered(s.name)}
                      onMouseLeave={() => setHovered(null)}
                    />
                  </g>
                );
              }
              return (
                <path
                  key={s.name}
                  d={s.d}
                  fill={lit ? 'hsl(var(--primary))' : hot ? '#cbd5e1' : '#e2e8f0'}
                  stroke={lit ? '#0f172a' : '#94a3b8'}
                  strokeWidth={lit ? 1.6 : 0.6}
                  vectorEffect="non-scaling-stroke"
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => pick(s.name)}
                  onMouseEnter={() => setHovered(s.name)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}

            {labelPoint && Number.isFinite(labelPoint[0]) && (
              <g transform={`translate(${labelPoint[0]},${labelPoint[1]})`}>
                <circle r={3 / view.k} fill="#0f172a" />
                <text
                  y={-8 / view.k}
                  textAnchor="middle"
                  className="font-semibold"
                  style={{ fontSize: 14 / view.k, paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 4 / view.k, fill: '#0f172a' }}
                >
                  {selected}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      <div className="rounded-xl border border-primary/20 bg-white/80 p-4 min-h-[76px]">
        {selected ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold text-slate-900">{selected}</p>
            {isRivers ? (
              selectedShape?.parent ? (
                <p className="text-sm text-slate-600">
                  Tributary of <span className="font-medium" style={{ color: systemColor(selectedShape.system) }}>{selectedShape.parent}</span>
                  {' · '}{selectedShape.system} system
                </p>
              ) : (
                <p className="text-sm text-slate-600">
                  Main river · {childrenOf(selected).length} tributaries mapped:{' '}
                  {childrenOf(selected).map((c) => c.name).join(', ') || '—'}
                </p>
              )
            ) : (
              <p className="text-sm text-slate-600">
                {kind === 'india-political' ? 'State / UT selected' : 'Country selected'} — dobara click karke deselect karo.
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            {isRivers
              ? 'Kisi bhi river line pe click karo — poori river light up hogi. Tributary click karoge to wo parent river ke colour me light hogi.'
              : 'Map pe click karo — boundary highlight hogi aur naam dikhega. Scroll/pinch = zoom, drag = pan.'}
          </p>
        )}
      </div>
    </div>
  );
}
