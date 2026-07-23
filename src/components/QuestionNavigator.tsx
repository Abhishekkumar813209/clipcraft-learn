import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Check, X, Bookmark, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type QStatus = 'correct' | 'wrong' | 'unattempted';

export interface QuestionNavigatorProps {
  total: number;
  current: number;
  statuses: QStatus[];         // length === total
  bookmarked?: boolean[];      // optional, length === total
  onSelect: (idx: number) => void;
  title?: string;
}

const styleFor = (s: QStatus, bookmarked: boolean, isCurrent: boolean) => {
  const base = 'relative w-9 h-9 rounded-md border text-xs font-semibold flex items-center justify-center transition';
  const ring = isCurrent ? ' ring-2 ring-offset-1 ring-blue-500' : '';
  if (s === 'correct') return base + ring + ' bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200';
  if (s === 'wrong')   return base + ring + ' bg-rose-100 border-rose-300 text-rose-800 hover:bg-rose-200';
  if (bookmarked)      return base + ring + ' bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100';
  return base + ring + ' bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
};

export function QuestionNavigator(props: QuestionNavigatorProps) {
  const { total, current, statuses, bookmarked = [], onSelect, title = 'Questions' } = props;
  const [open, setOpen] = useState(false);

  const counts = {
    correct: statuses.filter((s) => s === 'correct').length,
    wrong: statuses.filter((s) => s === 'wrong').length,
    unattempted: statuses.filter((s) => s === 'unattempted').length,
    bookmarked: bookmarked.filter(Boolean).length,
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 rounded-full h-11 w-11 shadow-lg bg-slate-900 hover:bg-slate-800 text-white"
          title="Question navigator"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[360px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-base">{title}</SheetTitle>
          <div className="flex flex-wrap gap-2 text-[11px] pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800"><Check className="w-3 h-3" />{counts.correct}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800"><X className="w-3 h-3" />{counts.wrong}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700"><Circle className="w-3 h-3" />{counts.unattempted}</span>
            {counts.bookmarked > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800"><Bookmark className="w-3 h-3" />{counts.bookmarked}</span>
            )}
          </div>
        </SheetHeader>
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: total }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => { onSelect(idx); setOpen(false); }}
                className={cn(styleFor(statuses[idx] ?? 'unattempted', !!bookmarked[idx], idx === current))}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
                {bookmarked[idx] && statuses[idx] === 'unattempted' && (
                  <Bookmark className="w-2.5 h-2.5 absolute top-0.5 right-0.5 fill-current text-amber-500" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 text-[11px] text-slate-500 leading-relaxed">
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded bg-emerald-100 border border-emerald-300" /> Correct</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded bg-rose-100 border border-rose-300" /> Wrong</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded bg-amber-50 border border-amber-300" /> Bookmarked (unattempted)</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded bg-white border border-slate-200" /> Unattempted</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
