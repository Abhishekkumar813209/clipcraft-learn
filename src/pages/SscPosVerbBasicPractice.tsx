import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, X, Lightbulb, Loader2, Sparkles, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Practice = {
  full_sentence: string;
  hint: string | null;
  error_in: string;
  correct_form: string | null;
  solution: string | null;
};

type Row = {
  id: string;
  q_no: number;
  full_sentence: string;
  part_a: string; part_b: string; part_c: string; part_d: string;
  error_in: string;
  correct_form: string | null;
  rule_tag: string | null;
  hint: string | null;
  solution: string | null;
  practice: Practice[];
};

const LETTERS = ['A', 'B', 'C', 'D'] as const;
type L = typeof LETTERS[number];

// Parse "(a) foo/ (b) bar/ (c) baz./ (d) No error." into 4 parts
function parsePracticeParts(sentence: string): [string, string, string, string] {
  const re = /\(([a-d])\)\s*([^]*?)(?=\s*\/?\s*\([a-d]\)|$)/gi;
  const parts: Record<string, string> = {};
  let m: RegExpExecArray | null;
  while ((m = re.exec(sentence)) !== null) {
    parts[m[1].toUpperCase()] = m[2].replace(/\/\s*$/, '').trim();
  }
  return [parts.A || '', parts.B || '', parts.C || '', parts.D || 'No error'];
}

export default function SscPosVerbBasicPractice() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const { pos = 'verb' } = useParams();
  const n = Number(sp.get('n')) || 20;

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<(L | null)[]>([]);
  const [hint, setHint] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);

  // drill state: when drilling, we show 3 practice variants for a given main index
  const [drillFor, setDrillFor] = useState<number | null>(null);
  const [drillI, setDrillI] = useState(0);
  const [drillPicks, setDrillPicks] = useState<(L | null)[]>([null, null, null]);
  const [drillHint, setDrillHint] = useState<Record<number, boolean>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('ssc_pos_spot_error' as never)
        .select('*').eq('pos', pos).eq('level', 'basic').order('q_no');
      const all = (data || []) as unknown as Row[];
      // shuffle & slice
      const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, Math.min(n, all.length));
      setRows(shuffled);
      setPicks(new Array(shuffled.length).fill(null));
      setLoading(false);
    })();
  }, [n, pos]);

  const q = rows[i];
  const picked = picks[i];
  const score = picks.reduce((a, p, idx) => a + (p && p === rows[idx]?.error_in ? 1 : 0), 0);

  function choose(letter: L) {
    if (picked !== null) return;
    const next = [...picks]; next[i] = letter; setPicks(next);
  }

  function nextQ() {
    if (i + 1 >= rows.length) { setDone(true); return; }
    setI(i + 1);
  }

  // Drill logic
  const drillRow = drillFor !== null ? rows[drillFor] : null;
  const drill = drillRow && drillRow.practice[drillI] ? drillRow.practice[drillI] : null;
  const drillParts = useMemo(() => drill ? parsePracticeParts(drill.full_sentence) : ['', '', '', ''] as [string,string,string,string], [drill]);
  const drillPicked = drillPicks[drillI];

  function drillChoose(letter: L) {
    if (drillPicked !== null) return;
    const next = [...drillPicks]; next[drillI] = letter; setDrillPicks(next);
  }
  function drillNext() {
    if (drillI + 1 >= 3) { exitDrill(); return; }
    setDrillI(drillI + 1);
  }
  function drillPrev() {
    if (drillI > 0) setDrillI(drillI - 1);
  }
  function startDrill() {
    setDrillFor(i);
    setDrillI(0);
    setDrillPicks([null, null, null]);
    setDrillHint({});
  }
  function exitDrill() {
    setDrillFor(null);
    setDrillI(0);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-emerald-50"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;

  if (!q) return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
      <Card><CardContent className="p-8 text-center space-y-3">
        <h2 className="text-xl font-bold">No questions</h2>
        <Button onClick={() => nav(-1)}>Back</Button>
      </CardContent></Card>
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="border-emerald-100"><CardContent className="p-8 text-center space-y-3">
          <Trophy className="w-14 h-14 mx-auto text-amber-500" />
          <h2 className="text-2xl font-bold">Session complete!</h2>
          <div className="text-5xl font-bold text-emerald-600">{score} / {rows.length}</div>
          <div className="text-slate-500">{Math.round((score / rows.length) * 100)}% correct</div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => nav(-1)}>Back</Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => { setI(0); setPicks(new Array(rows.length).fill(null)); setHint({}); setDone(false); }}>Play again</Button>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );

  // DRILL VIEW
  if (drillFor !== null && drillRow && drill) {
    const drillOptions: [L, string][] = [['A', drillParts[0]], ['B', drillParts[1]], ['C', drillParts[2]], ['D', drillParts[3]]];
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="text-amber-800 hover:bg-white" onClick={exitDrill}>
              <ArrowLeft className="w-4 h-4 mr-1" />Back to Q{drillFor + 1}
            </Button>
            <div className="text-sm text-amber-800 font-semibold flex items-center gap-1">
              <Sparkles className="w-4 h-4" />Drill {drillI + 1}/3 · from Q{drillFor + 1}
            </div>
          </div>
          <Card className="border-amber-200 shadow-sm ring-1 ring-amber-100">
            <CardContent className="p-6 space-y-4">
              <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Similar Practice</div>
              <div className="text-base font-medium text-slate-800">Spot the error in the sentence below.</div>
              {drill.full_sentence && (
                <div className="rounded-md border border-amber-100 bg-white/70 p-3 text-slate-700 italic">
                  {drill.full_sentence}
                </div>
              )}
              {drillPicked === null && drill.hint && (
                drillHint[drillI] ? (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm italic text-amber-800 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 mt-0.5" />{drill.hint}
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setDrillHint({ ...drillHint, [drillI]: true })}>
                    <Lightbulb className="w-4 h-4 mr-1" />Show hint
                  </Button>
                )
              )}
              <div className="space-y-2">
                {drillOptions.map(([letter, text]) => {
                  const show = drillPicked !== null;
                  const isCorrect = drill.error_in === letter;
                  const isPicked = drillPicked === letter;
                  return (
                    <button key={letter} onClick={() => drillChoose(letter)}
                      className={`w-full text-left p-3 rounded-md border transition-all ${
                        show && isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                        show && isPicked ? 'border-rose-400 bg-rose-50 text-rose-800' :
                        'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/60'
                      }`}>
                      <span className="font-semibold mr-2">({letter.toLowerCase()})</span>{text}
                    </button>
                  );
                })}
              </div>
              {drillPicked !== null && (
                <div className="rounded-md border border-emerald-100 bg-emerald-50/50 p-3 text-sm space-y-1">
                  {drill.correct_form && <div><span className="font-semibold">Correct:</span> {drill.correct_form}</div>}
                  {drill.solution && <div className="text-slate-700 whitespace-pre-wrap">{drill.solution}</div>}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-40" onClick={drillI > 0 ? drillPrev : exitDrill} disabled={false}>
                  {drillI > 0 ? <><ChevronLeft className="w-4 h-4 mr-1" />Previous drill</> : <><ArrowLeft className="w-4 h-4 mr-1" />Back to Q{drillFor + 1}</>}
                </Button>
                <Button className="flex-1 bg-amber-600 hover:bg-amber-500 text-white" onClick={drillNext} disabled={drillPicked === null}>
                  {drillI + 1 >= 3 ? `Return to Q${drillFor + 1}` : <>Next drill<ChevronRight className="w-4 h-4 ml-1" /></>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // MAIN VIEW
  const options: [L, string][] = [['A', q.part_a], ['B', q.part_b], ['C', q.part_c], ['D', q.part_d]];
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" />Back
          </Button>
          <div className="text-sm text-slate-500">Q {i + 1} / {rows.length} · Score <span className="text-emerald-700 font-semibold">{score}</span></div>
        </div>
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">{
              pos === 'passive_voice_mcq' ? 'Passive Voice · MCQ' :
              pos === 'narration_mcq' ? 'Narration · MCQ' :
              pos === 'narration_spot' ? 'Narration · Spot the Error' :
              'Spot the Error'
            }</div>
            <div className="text-base font-medium text-slate-800">{
              pos === 'passive_voice_mcq' ? 'Choose the correct passive-voice form of the sentence below.' :
              pos === 'narration_mcq' ? 'Choose the correct direct/indirect speech form of the sentence below.' :
              'Spot the error in the sentence below. Choose the part that contains the mistake, or "No error" if the sentence is correct.'
            }</div>
            {q.full_sentence && (
              <div className="rounded-md border border-emerald-100 bg-white/70 p-3 text-slate-700 italic">
                {q.full_sentence}
              </div>
            )}
            {picked === null && q.hint && (
              hint[i] ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm italic text-amber-800 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 mt-0.5" />{q.hint}
                </div>
              ) : (
                <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setHint({ ...hint, [i]: true })}>
                  <Lightbulb className="w-4 h-4 mr-1" />Show hint
                </Button>
              )
            )}
            <div className="space-y-2">
              {options.map(([letter, text]) => {
                const show = picked !== null;
                const isCorrect = q.error_in === letter;
                const isPicked = picked === letter;
                return (
                  <button key={letter} onClick={() => choose(letter)}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      show && isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                      show && isPicked ? 'border-rose-400 bg-rose-50 text-rose-800' :
                      'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/60'
                    }`}>
                    <span className="font-semibold mr-2">({letter.toLowerCase()})</span>{text}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="rounded-md border border-emerald-100 bg-emerald-50/50 p-4 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  {picked === q.error_in
                    ? <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold"><Check className="w-4 h-4" />Correct</span>
                    : <span className="inline-flex items-center gap-1 text-rose-700 font-semibold"><X className="w-4 h-4" />Not quite</span>}
                  <span className="text-slate-500">· Error in ({q.error_in.toLowerCase()})</span>
                </div>
                {q.correct_form && <div><span className="font-semibold">Correct form:</span> {q.correct_form}</div>}
                {q.rule_tag && <div className="text-xs text-slate-500">{q.rule_tag}</div>}
                {q.solution && <div className="text-slate-700 whitespace-pre-wrap">{q.solution}</div>}
                <Button size="sm" className="mt-2 bg-amber-500 hover:bg-amber-400 text-white" onClick={startDrill}>
                  <Sparkles className="w-4 h-4 mr-1" />Practice More (3 similar)
                </Button>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40" onClick={() => i > 0 && setI(i - 1)} disabled={i === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" />Previous
              </Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={nextQ}>
                {i + 1 >= rows.length ? 'Finish' : <>Next<ChevronRight className="w-4 h-4 ml-1" /></>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
