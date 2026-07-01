import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchBBItems, buildQuestionSet, BBItem, BBQuestion } from '@/lib/blackBookQuiz';
import { BlackBookExplanation } from '@/components/BlackBookExplanation';

import { Loader2, Copy, Swords, Trophy, Clock } from 'lucide-react';

interface Match {
  id: string;
  host_id: string;
  guest_id: string | null;
  category: string;
  status: 'waiting' | 'live' | 'done';
  question_ids: string[];
  seconds_per_q: number;
  winner_id: string | null;
  started_at: string | null;
}
interface Answer { user_id: string; q_index: number; is_correct: boolean; ms_taken: number; }

export default function BlackBookDuel() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [match, setMatch] = useState<Match | null>(null);
  const [items, setItems] = useState<BBItem[]>([]);
  const [qs, setQs] = useState<BBQuestion[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(30);
  const qStartRef = useRef<number>(Date.now());

  // Load match + items
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: m } = await supabase.from('duel_matches' as never).select('*').eq('id', id).single();
      const mm = m as Match;
      setMatch(mm);
      const all = await fetchBBItems(mm.category === 'mixed' ? undefined : (mm.category as any));
      setItems(all);
      setQs(buildQuestionSet(all, mm.question_ids.length, mm.question_ids));
    })();
  }, [id]);

  // Realtime subscription
  useEffect(() => {
    if (!id) return;
    const ch = supabase.channel(`duel:${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'duel_matches', filter: `id=eq.${id}` }, (p) => {
        setMatch(p.new as Match);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'duel_answers', filter: `match_id=eq.${id}` }, (p) => {
        setAnswers((prev) => [...prev, p.new as Answer]);
      })
      .subscribe();
    // seed existing answers
    supabase.from('duel_answers' as never).select('*').eq('match_id', id).then(({ data }) => {
      if (data) setAnswers(data as Answer[]);
    });
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  // Join as guest
  useEffect(() => {
    if (!match || !user || match.host_id === user.id || match.guest_id) return;
    supabase.from('duel_matches' as never).update({ guest_id: user.id, status: 'live', started_at: new Date().toISOString() } as never).eq('id', match.id).then(() => {});
  }, [match, user]);

  // Timer
  useEffect(() => {
    if (!match || match.status !== 'live' || picked !== null) return;
    qStartRef.current = Date.now();
    setRemaining(match.seconds_per_q);
    const iv = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(iv); autoSubmit(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [i, match?.status]);

  async function submitAnswer(selectedIdx: number) {
    if (picked !== null || !user || !match || !qs[i]) return;
    setPicked(selectedIdx);
    const isCorrect = selectedIdx === qs[i].correct;
    const ms = Date.now() - qStartRef.current;
    await supabase.from('duel_answers' as never).insert({
      match_id: match.id, user_id: user.id, q_index: i, selected: selectedIdx, is_correct: isCorrect, ms_taken: ms,
    } as never);
  }

  function autoSubmit() { if (picked === null) submitAnswer(-1); }

  function next() {
    if (i + 1 >= qs.length) {
      finish();
      return;
    }
    setI(i + 1); setPicked(null);
  }

  async function finish() {
    if (!match) return;
    // Compute winner
    const myAns = answers.filter((a) => a.user_id === user?.id);
    const oppId = user?.id === match.host_id ? match.guest_id : match.host_id;
    const oppAns = answers.filter((a) => a.user_id === oppId);
    const myScore = myAns.filter((a) => a.is_correct).length;
    const oppScore = oppAns.filter((a) => a.is_correct).length;
    let winner: string | null = null;
    if (myScore !== oppScore) winner = myScore > oppScore ? user!.id : (oppId || null);
    else {
      const myMs = myAns.reduce((s, a) => s + a.ms_taken, 0);
      const oppMs = oppAns.reduce((s, a) => s + a.ms_taken, 0);
      winner = myMs < oppMs ? user!.id : (oppId || null);
    }
    await supabase.from('duel_matches' as never).update({ status: 'done', ended_at: new Date().toISOString(), winner_id: winner } as never).eq('id', match.id);
  }

  const isHost = user?.id === match?.host_id;
  const myAnswers = answers.filter((a) => a.user_id === user?.id);
  const oppId = isHost ? match?.guest_id : match?.host_id;
  const oppAnswers = answers.filter((a) => a.user_id === oppId);
  const myScore = myAnswers.filter((a) => a.is_correct).length;
  const oppScore = oppAnswers.filter((a) => a.is_correct).length;

  if (!match || !qs.length) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  // Waiting for guest
  if (match.status === 'waiting') {
    const link = `${window.location.origin}/ssc/duel/${match.id}`;
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
        <Card className="bg-slate-900/70 border-blue-900/40 max-w-md w-full">
          <CardContent className="p-6 space-y-4 text-center">
            <Swords className="w-12 h-12 text-pink-400 mx-auto animate-pulse" />
            <h2 className="text-xl font-bold">Waiting for opponent...</h2>
            <div className="p-3 bg-slate-800 rounded text-xs break-all">{link}</div>
            <Button className="w-full" onClick={() => { navigator.clipboard.writeText(link); toast({ title: 'Link copied!' }); }}>
              <Copy className="w-4 h-4 mr-2" /> Copy invite link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (match.status === 'done') {
    const iWon = match.winner_id === user?.id;
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <Card className="bg-slate-900/70 border-blue-900/40 max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <Trophy className={`w-16 h-16 mx-auto ${iWon ? 'text-yellow-400' : 'text-slate-500'}`} />
            <h2 className="text-3xl font-bold">{iWon ? 'You won!' : match.winner_id ? 'You lost' : 'Draw'}</h2>
            <div className="flex justify-around text-xl">
              <div><div className="text-slate-400 text-xs">You</div><div className="font-bold">{myScore}</div></div>
              <div><div className="text-slate-400 text-xs">Opponent</div><div className="font-bold">{oppScore}</div></div>
            </div>
            <Button className="w-full" onClick={() => (window.location.href = '/ssc/blackbook')}>Back to hub</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = qs[i];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950 text-slate-100 p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">Q {i + 1} / {qs.length}</div>
          <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4" />{remaining}s</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-blue-950/40 border-blue-800/40"><CardContent className="p-3 text-center"><div className="text-xs text-slate-400">You</div><div className="text-2xl font-bold">{myScore}</div><div className="text-xs">{myAnswers.length}/{qs.length} answered</div></CardContent></Card>
          <Card className="bg-pink-950/40 border-pink-800/40"><CardContent className="p-3 text-center"><div className="text-xs text-slate-400">Opponent</div><div className="text-2xl font-bold">{oppScore}</div><div className="text-xs">{oppAnswers.length}/{qs.length} answered</div></CardContent></Card>
        </div>
        <Card className="bg-slate-900/70 border-blue-900/40">
          <CardContent className="p-6 space-y-4">
            <div className="text-lg font-medium">{q.question}</div>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const isCorrect = q.correct === idx;
                const isPicked = picked === idx;
                const show = picked !== null;
                return (
                  <button key={idx} disabled={show} onClick={() => submitAnswer(idx)}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      show && isCorrect ? 'border-emerald-500 bg-emerald-500/10' :
                      show && isPicked ? 'border-red-500 bg-red-500/10' :
                      'border-slate-700 hover:border-blue-400 hover:bg-blue-500/5'
                    }`}>
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <Button className="w-full" onClick={next}>{i + 1 >= qs.length ? 'Finish' : 'Next question'}</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
