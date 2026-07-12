import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Check, X, ChevronRight, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BBCategory, BBItem } from '@/lib/blackBookQuiz';
import { BlackBookExplanation } from '@/components/BlackBookExplanation';
import { useWordHindi, lookupHindi } from '@/lib/wordHindi';

interface SessionRow {
  id: string; category: string; total: number; correct: number; created_at: string;
}
interface AttemptRow {
  id: string; session_id: string; item_id: string | null; category: string;
  question: string; options: string[]; correct_index: number; picked_index: number | null;
  is_correct: boolean; created_at: string;
}

const CATS: { key: BBCategory; label: string }[] = [
  { key: 'syn_ant', label: 'Synonyms & Antonyms' },
  { key: 'idiom', label: 'Idioms & Phrases' },
  { key: 'ows', label: 'One Word Substitutions' },
];

export default function BlackBookHistory() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [items, setItems] = useState<BBItem[]>([]);
  const [openSession, setOpenSession] = useState<string | null>(null);

  const [saItems, setSaItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // paginate items so lookups for items beyond the default 1000 row cap still resolve
      async function fetchAll(table: string): Promise<any[]> {
        const out: any[] = [];
        const pageSize = 1000;
        let from = 0;
        while (true) {
          const { data, error } = await supabase.from(table as never).select('*').range(from, from + pageSize - 1);
          if (error) break;
          const rows = (data as any[]) || [];
          out.push(...rows);
          if (rows.length < pageSize) break;
          from += pageSize;
        }
        return out;
      }
      const [{ data: s }, { data: a }, bbAll, saAll] = await Promise.all([
        supabase.from('bb_practice_sessions' as never).select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('bb_practice_attempts' as never).select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        fetchAll('ssc_black_book_items'),
        fetchAll('ssc_syn_ant_items'),
      ]);
      setSessions((s as any) || []);
      setAttempts((a as any) || []);
      setItems(bbAll as BBItem[]);
      setSaItems(saAll);
      setLoading(false);
    })();
  }, [user]);

  const itemById = useMemo(() => {
    const m = new Map<string, BBItem>();
    items.forEach((it) => m.set(it.id, it));
    // Map syn/ant items into BBItem-ish shape so history can display them
    saItems.forEach((it) => {
      m.set(it.id, {
        id: it.id,
        category: 'syn_ant',
        serial_no: it.serial_no ?? null,
        prompt: it.word,
        answer: it.word,
        pos: null,
        hindi_meaning: null,
        english_meaning: it.meaning ?? null,
        hinglish_meaning: it.hinglish_meaning ?? null,
        synonyms: it.synonyms ? String(it.synonyms).split(/[,;/|]/).map((x: string) => x.trim()).filter(Boolean) : null,
        antonyms: it.antonyms ? String(it.antonyms).split(/[,;/|]/).map((x: string) => x.trim()).filter(Boolean) : null,
        example: it.example_sentence ?? null,
      } as BBItem);
    });
    return m;
  }, [items, saItems]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-emerald-50 text-slate-700"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/ssc/blackbook')}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
          <h1 className="text-xl font-bold">Practice History</h1>
          <div className="w-16" />
        </div>

        <Tabs defaultValue="syn_ant">
          <TabsList className="bg-white border border-emerald-100">
            {CATS.map((c) => (
              <TabsTrigger key={c.key} value={c.key} className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{c.label}</TabsTrigger>
            ))}
          </TabsList>

          {CATS.map((c) => (
            <TabsContent key={c.key} value={c.key} className="space-y-6 mt-4">
              <WeakWordsSection
                category={c.key}
                attempts={attempts.filter((a) => a.category === c.key)}
                itemById={itemById}
              />
              <SessionsSection
                sessions={sessions.filter((s) => s.category === c.key)}
                attempts={attempts}
                itemById={itemById}
                openSession={openSession}
                setOpenSession={setOpenSession}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function WeakWordsSection({ category, attempts, itemById }: { category: BBCategory; attempts: AttemptRow[]; itemById: Map<string, BBItem> }) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const stats = useMemo(() => {
    const map = new Map<string, { wrong: number; total: number; item: BBItem | undefined }>();
    for (const a of attempts) {
      if (!a.item_id) continue;
      const cur = map.get(a.item_id) || { wrong: 0, total: 0, item: itemById.get(a.item_id) };
      cur.total += 1;
      if (!a.is_correct) cur.wrong += 1;
      map.set(a.item_id, cur);
    }
    return Array.from(map.entries())
      .map(([id, v]) => ({ id, ...v }))
      .filter((x) => x.wrong > 0)
      .sort((a, b) => b.wrong - a.wrong);
  }, [attempts, itemById]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Words you get wrong most</h3>
      {stats.length === 0 && (
        <Card className="bg-white border-emerald-100 shadow-sm"><CardContent className="p-6 text-center text-slate-500 text-sm">No wrong answers yet in this category — start practicing!</CardContent></Card>
      )}
      {stats.map((s) => {
        const it = s.item;
        const acc = s.total > 0 ? Math.round(((s.total - s.wrong) / s.total) * 100) : 0;
        return (
          <div key={s.id}>
            <Card className="bg-white border-emerald-100 shadow-sm cursor-pointer hover:border-emerald-300 transition" onClick={() => setOpenItem(openItem === s.id ? null : s.id)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{it?.prompt || '(deleted item)'}</div>
                  {it?.hindi_meaning && <div className="text-xs text-amber-700 truncate">{it.hindi_meaning}</div>}
                </div>
                <Badge className="bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-100">{s.wrong} wrong</Badge>
                <span className="text-xs text-slate-500 tabular-nums">{acc}%</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition ${openItem === s.id ? 'rotate-90' : ''}`} />
              </CardContent>
            </Card>
            {openItem === s.id && it && (
              <div className="mt-2"><BlackBookExplanation item={it} /></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SessionsSection({ sessions, attempts, itemById, openSession, setOpenSession }: {
  sessions: SessionRow[]; attempts: AttemptRow[]; itemById: Map<string, BBItem>;
  openSession: string | null; setOpenSession: (s: string | null) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Past Sessions</h3>
      {sessions.length === 0 && (
        <Card className="bg-white border-emerald-100 shadow-sm"><CardContent className="p-6 text-center text-slate-500 text-sm">No sessions yet.</CardContent></Card>
      )}
      {sessions.map((s) => {
        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        const isOpen = openSession === s.id;
        const sessionAttempts = attempts.filter((a) => a.session_id === s.id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        return (
          <div key={s.id}>
            <Card className="bg-white border-emerald-100 shadow-sm cursor-pointer hover:border-emerald-300 transition" onClick={() => setOpenSession(isOpen ? null : s.id)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{new Date(s.created_at).toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{s.correct} / {s.total} correct · {pct}%</div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition ${isOpen ? 'rotate-90' : ''}`} />
              </CardContent>
            </Card>
            {isOpen && (
              <div className="mt-2 space-y-2">
                <div className="text-xs text-slate-500 flex items-center gap-1 pl-1"><RotateCcw className="w-3 h-3" />Double-click any question card to flip options between English and Hindi.</div>
                {sessionAttempts.map((a, idx) => (
                  <AttemptCard key={a.id} attempt={a} idx={idx} itemById={itemById} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AttemptCard({ attempt, idx, itemById }: { attempt: AttemptRow; idx: number; itemById: Map<string, BBItem> }) {
  const [showHindi, setShowHindi] = useState(false);
  const ok = attempt.is_correct;

  const wordHindi = useWordHindi();

  // Build Hindi lookup for each option: match option text against known item prompts/answers, then fall back to shared word_hindi table.
  const hindiOptions = useMemo(() => {
    const map = new Map<string, string>();
    itemById.forEach((it) => {
      const meaning = it.hinglish_meaning || it.hindi_meaning;
      if (!meaning) return;
      if (it.prompt) map.set(it.prompt.toLowerCase(), meaning);
      if (it.answer) map.set(it.answer.toLowerCase(), meaning);
    });
    return attempt.options.map((o) => map.get(o.trim().toLowerCase()) || lookupHindi(wordHindi, o) || '—');
  }, [attempt.options, itemById, wordHindi]);

  const item = attempt.item_id ? itemById.get(attempt.item_id) : undefined;

  return (
    <Card
      className={`bg-white border-emerald-100 shadow-sm ${showHindi ? 'ring-2 ring-amber-200' : ''}`}
      onDoubleClick={() => setShowHindi((v) => !v)}
    >
      <CardContent className="p-4 space-y-2 select-none">
        <div className="flex items-start gap-2">
          <span className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
          </span>
          <div className="flex-1">
            <div className="text-xs text-slate-500 flex items-center gap-2">Q{idx + 1} {showHindi && <span className="text-amber-700 font-semibold">Hindi view</span>}</div>
            <div className="font-medium text-slate-900">{attempt.question}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-8">
          {attempt.options.map((opt, oi) => {
            const isCorrect = oi === attempt.correct_index;
            const isPicked = oi === attempt.picked_index;
            const text = showHindi ? hindiOptions[oi] : opt;
            return (
              <div key={oi} className={`text-sm px-2.5 py-1.5 rounded border ${
                isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-800' :
                isPicked ? 'border-rose-300 bg-rose-50 text-rose-800' :
                'border-slate-200 bg-white text-slate-600'
              }`}>
                <span className="font-semibold mr-1">{String.fromCharCode(65 + oi)}.</span>{text}
              </div>
            );
          })}
        </div>
        {item && (
          <div className="pl-8 pt-1"><BlackBookExplanation item={item} /></div>
        )}
      </CardContent>
    </Card>
  );
}
