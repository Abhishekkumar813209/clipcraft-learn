import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Check, X, Play, Shuffle, RotateCcw, ChevronDown } from 'lucide-react';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';

interface HWord {
  id: string;
  group_no: number;
  word: string;
  pos: string | null;
  hinglish_meaning: string;
}

interface HQ {
  target: HWord;
  options: HWord[];
}

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function buildQuestions(rows: HWord[], all: HWord[], random: boolean): HQ[] {
  const byGroup = new Map<number, HWord[]>();
  for (const w of all) {
    const g = byGroup.get(w.group_no) || [];
    g.push(w);
    byGroup.set(w.group_no, g);
  }
  const base = random ? shuffle(rows) : rows;
  return base.map((target) => {
    const siblings = (byGroup.get(target.group_no) || []).filter((w) => w.id !== target.id);
    const picked: HWord[] = shuffle(siblings).slice(0, 4);
    const pool = shuffle(all).filter(
      (w) => w.id !== target.id && w.group_no !== target.group_no && !picked.some((p) => p.id === w.id),
    );
    while (picked.length < 4 && pool.length) picked.push(pool.pop()!);
    return { target, options: shuffle([target, ...picked]) };
  });
}

export default function SscHomonyms() {
  const nav = useNavigate();
  const [all, setAll] = useState<HWord[]>([]);
  const [maxGroup, setMaxGroup] = useState(0);
  const [from, setFrom] = useState('1');
  const [to, setTo] = useState('20');
  const [qs, setQs] = useState<HQ[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(string | null)[]>([]);
  const [openOpt, setOpenOpt] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('ssc_homonym_words' as never)
        .select('id,group_no,word,pos,hinglish_meaning')
        .order('group_no')
        .limit(2000);
      const rows = (data as unknown as HWord[]) || [];
      setAll(rows);
      setMaxGroup(rows.reduce((m, r) => Math.max(m, r.group_no), 0));
    })();
  }, []);

  const groupMap = useMemo(() => {
    const m = new Map<number, HWord[]>();
    for (const w of all) {
      const g = m.get(w.group_no) || [];
      g.push(w);
      m.set(w.group_no, g);
    }
    return m;
  }, [all]);

  const start = (order: 'serial' | 'random') => {
    const f = Math.max(1, Number(from) || 1);
    const t = Math.max(f, Number(to) || f);
    const rows = all.filter((w) => w.group_no >= f && w.group_no <= t);
    setQs(buildQuestions(rows, all, order === 'random'));
    setPicked([]);
    setIdx(0);
    setOpenOpt(null);
  };

  const statuses: QStatus[] = useMemo(
    () => (qs || []).map((q, i) => (picked[i] == null ? 'unattempted' : picked[i] === q.target.id ? 'correct' : 'wrong')),
    [qs, picked],
  );

  if (!qs) {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> SSC English
        </Button>
        <div className="flex items-start gap-3">
          <span className="text-3xl">🎭</span>
          <div>
            <h1 className="text-2xl font-bold">Homonyms</h1>
            <p className="text-sm text-muted-foreground">
              Hinglish meaning padho, sahi English word chuno — 5 options. Answer ke baad har option flip karke uske
              poore homonym group ka matlab dekho.
            </p>
          </div>
        </div>

        <Card className="border-emerald-100">
          <CardContent className="p-5 space-y-4">
            <div className="text-sm font-medium">
              Group range chuno (1 – {maxGroup || '…'}) · total {all.length} words
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-[11px] text-muted-foreground">From</label>
                <Input inputMode="numeric" value={from} onChange={(e) => setFrom(e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-muted-foreground">To</label>
                <Input inputMode="numeric" value={to} onChange={(e) => setTo(e.target.value.replace(/\D/g, ''))} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[[1, 20], [21, 50], [51, 100], [1, maxGroup || 179]].map(([f, t]) => (
                <Button key={`${f}-${t}`} size="sm" variant="outline" className="border-emerald-200 text-emerald-700"
                  onClick={() => { setFrom(String(f)); setTo(String(t)); }}>
                  {f} – {t}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" disabled={!all.length} onClick={() => start('serial')}>
                <Play className="w-4 h-4 mr-1" /> Serial
              </Button>
              <Button variant="outline" className="flex-1" disabled={!all.length} onClick={() => start('random')}>
                <Shuffle className="w-4 h-4 mr-1" /> Random
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!qs.length) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setQs(null)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Range
        </Button>
        <p className="text-muted-foreground">Is range me koi word nahi mila.</p>
      </div>
    );
  }

  const cur = qs[idx];
  const answer = picked[idx] ?? null;
  const score = statuses.filter((s) => s === 'correct').length;
  const attempted = statuses.filter((s) => s !== 'unattempted').length;

  const pick = (id: string) => {
    if (answer) return;
    setPicked((p) => { const c = [...p]; c[idx] = id; return c; });
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 pb-24">
      <QuestionNavigator total={qs.length} current={idx} statuses={statuses} onSelect={(i) => { setIdx(i); setOpenOpt(null); }} title="🎭 Homonyms" />

      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => setQs(null)} className="text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" /> Range
        </Button>
        <div className="text-sm text-slate-600 mr-12">
          Q {idx + 1}/{qs.length} · <span className="text-emerald-600 font-semibold">{score}</span>/{attempted} correct
        </div>
      </div>

      <Card className="border-emerald-100">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="uppercase font-semibold tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Group {cur.target.group_no}
            </span>
            {cur.target.pos && <span className="text-slate-500">{cur.target.pos}</span>}
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">Is meaning ka sahi English word chuno:</p>
            <p className="text-base font-medium text-slate-800 leading-relaxed">{cur.target.hinglish_meaning}</p>
          </div>

          <div className="space-y-2">
            {cur.options.map((o) => {
              const isCorrect = o.id === cur.target.id;
              const isPicked = answer === o.id;
              const cls = !answer
                ? 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                : isCorrect
                  ? 'border-emerald-400 bg-emerald-50'
                  : isPicked
                    ? 'border-rose-400 bg-rose-50'
                    : 'border-slate-200 opacity-80';
              const group = (groupMap.get(o.group_no) || []).filter((w) => w.id !== o.id);
              return (
                <div key={o.id}>
                  <button
                    onClick={() => (answer ? setOpenOpt(openOpt === o.id ? null : o.id) : pick(o.id))}
                    className={`w-full text-left rounded-lg border px-3 py-2.5 flex items-start gap-3 transition ${cls}`}
                  >
                    <span className="text-sm flex-1 font-medium">{o.word}</span>
                    {answer && isCorrect && <Check className="w-4 h-4 text-emerald-600 mt-0.5" />}
                    {answer && isPicked && !isCorrect && <X className="w-4 h-4 text-rose-600 mt-0.5" />}
                    {answer && <ChevronDown className={`w-4 h-4 text-slate-400 mt-0.5 transition ${openOpt === o.id ? 'rotate-180' : ''}`} />}
                  </button>

                  {answer && openOpt === o.id && (
                    <div className={`mt-1 rounded-md border p-3 text-sm space-y-2 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                      <p className="text-slate-700">
                        <span className="font-semibold">{o.word}</span>
                        {o.pos && <span className="text-[11px] text-slate-500"> · {o.pos}</span>} — {o.hinglish_meaning}
                      </p>
                      {group.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">
                            Iske homonyms (Group {o.group_no})
                          </p>
                          {group.map((g) => (
                            <p key={g.id} className="text-[13px] text-slate-700">
                              <span className="font-semibold">{g.word}</span>
                              {g.pos && <span className="text-[11px] text-slate-500"> · {g.pos}</span>} — {g.hinglish_meaning}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {answer && (
            <p className="text-[11px] text-slate-500">Har option pe click karke uska matlab aur uske baaki homonyms dekho.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => { setIdx((i) => i - 1); setOpenOpt(null); }}>
          <ArrowLeft className="w-4 h-4 mr-1" />Prev
        </Button>
        {idx < qs.length - 1 ? (
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => { setIdx((i) => i + 1); setOpenOpt(null); }}>
            Next<ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => { setPicked([]); setIdx(0); setOpenOpt(null); }}>
            <RotateCcw className="w-4 h-4 mr-1" />Restart
          </Button>
        )}
      </div>
    </div>
  );
}
