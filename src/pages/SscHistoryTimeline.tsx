import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronDown, ChevronRight, Play, Route as RouteIcon } from 'lucide-react';
import { TIMELINE, type TimelineEvent } from '@/lib/timelineQuiz';

const dotColor = (kind?: string) =>
  kind === 'war' ? 'bg-rose-500' : kind === 'policy' ? 'bg-amber-500' : kind === 'accession' ? 'bg-emerald-500' : 'bg-sky-500';

const kindLabel = (kind?: string) =>
  kind === 'war' ? 'War' : kind === 'policy' ? 'Policy' : kind === 'accession' ? 'Accession' : 'Event';

function MetroEvent({ e }: { e: TimelineEvent }) {
  return (
    <div className="relative pl-8 pb-6">
      <span className="absolute left-[9px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white shadow-sm z-10 block" />
      <span className={`absolute left-[9px] top-1.5 w-3.5 h-3.5 rounded-full z-20 block ${dotColor(e.kind)}`} />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-slate-900 tabular-nums">{e.y}</span>
        <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-600">{kindLabel(e.kind)}</Badge>
        {e.span && <span className="text-[11px] text-slate-500">{e.span}</span>}
      </div>
      <div className="font-semibold text-slate-800 text-sm mt-0.5">{e.title}</div>
      {e.who && <div className="text-[11px] text-emerald-700 font-medium">{e.who}</div>}
      {e.detail && <p className="text-sm text-slate-600 leading-relaxed mt-1">{e.detail}</p>}
      {e.reason && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 mt-1.5">
          <span className="font-semibold">Kyu hua: </span>{e.reason}
        </p>
      )}
    </div>
  );
}

export default function SscHistoryTimeline() {
  const nav = useNavigate();
  const { subject } = useParams();
  const key = subject || '';
  const sub = TIMELINE[key];
  const [open, setOpen] = useState<string | null>(sub?.chapters[0]?.key ?? null);

  if (!sub) {
    return (
      <div className="p-6 space-y-3">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/gk')}><ArrowLeft className="w-4 h-4 mr-1" /> GK / GS</Button>
        <p className="text-sm text-slate-600">Is subject ki timeline abhi available nahi hai.</p>
      </div>
    );
  }

  const totalEvents = sub.chapters.reduce((s, c) => s + c.events.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-3xl mx-auto space-y-5">
        <Button variant="ghost" size="sm" className="text-emerald-700 -ml-2" onClick={() => nav(`/ssc/gk/${key}`)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> {sub.label}
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-3xl">🚇</span>
          <div>
            <h1 className="text-2xl font-bold">{sub.label} — Metro Map Timeline</h1>
            <p className="text-sm text-slate-500">{sub.chapters.length} chapters · {totalEvents} events · chronology pakki karo</p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><RouteIcon className="w-4 h-4" /> Poora timeline quiz</h3>
              <p className="text-xs text-slate-600">Saare chapters mila kar 100 chronology MCQs — har option flip karke reason padho.</p>
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 shrink-0" onClick={() => nav(`/ssc/gk/${key}/timeline/quiz`)}>
              <Play className="w-4 h-4 mr-1" /> Start
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {sub.chapters.map((c) => {
            const isOpen = open === c.key;
            return (
              <Card key={c.key} className="bg-white/85 border-emerald-100">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <button className="flex items-start gap-2 text-left flex-1 min-w-0" onClick={() => setOpen(isOpen ? null : c.key)}>
                      {isOpen ? <ChevronDown className="w-4 h-4 mt-1 text-emerald-600" /> : <ChevronRight className="w-4 h-4 mt-1 text-emerald-600" />}
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{c.title}</h3>
                        {c.blurb && <p className="text-xs text-slate-500 mt-0.5">{c.blurb}</p>}
                      </div>
                    </button>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">{c.events.length}</Badge>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500"
                        onClick={() => nav(`/ssc/gk/${key}/timeline/quiz?chapter=${encodeURIComponent(c.key)}`)}>
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="relative pt-2">
                      <span className="absolute left-[15px] top-3 bottom-2 w-0.5 bg-gradient-to-b from-emerald-300 via-emerald-200 to-transparent" />
                      {c.events.map((e, i) => <MetroEvent key={`${e.y}-${i}`} e={e} />)}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
