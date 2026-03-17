import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBpscSubmitAnswer } from '@/hooks/useBpscProgress';
import { BPSC_TOPIC_META, BPSC_ALL_TOPICS, type BpscTopic, type BpscQuestion } from '@/types/bpsc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TIMER_SECONDS = 60;

export default function BpscPyqSession() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const submitAnswer = useBpscSubmitAnswer();

  const topicFilter = searchParams.get('topic') || 'all';
  const yearFilter = searchParams.get('year') || 'all';
  const monthFilter = searchParams.get('month') || 'all';
  const qIndex = parseInt(searchParams.get('q') || '0');

  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch PYQ questions
  const { data: pyqQuestions, isLoading } = useQuery({
    queryKey: ['bpsc-pyq-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ssc_questions')
        .select('*')
        .eq('is_pyq', true)
        .eq('exam', 'BPSC' as any)
        .in('topic', [...BPSC_ALL_TOPICS] as any);
      if (error) throw error;
      return (data || []).map((q: any) => ({
        id: q.id,
        topic: q.topic as BpscTopic,
        question_text: q.question_text,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty: q.difficulty,
        year: q.year,
      }));
    },
  });

  // Filtered questions - stable sort by id to avoid random reorder on refresh
  const filtered = useMemo(() => {
    if (!pyqQuestions) return [];
    return pyqQuestions.filter(q => {
      if (topicFilter !== 'all' && q.topic !== topicFilter) return false;
      if (yearFilter !== 'all' && q.year !== parseInt(yearFilter)) return false;
      if (monthFilter !== 'all' && (q as any).month !== parseInt(monthFilter)) return false;
      return true;
    }).sort((a, b) => a.id.localeCompare(b.id));
  }, [pyqQuestions, topicFilter, yearFilter, monthFilter]);

  const current = filtered[qIndex];

  // Reset state when question changes
  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setTimer(TIMER_SECONDS);
    setAiExplanation(null);
  }, [qIndex]);

  // Timer
  useEffect(() => {
    if (showResult || !current) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          handleAnswer(-1);
          return TIMER_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showResult, current, qIndex]);

  const updateQ = useCallback((newIdx: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('q', newIdx.toString());
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleAnswer = (optionIdx: number) => {
    if (showResult || !current) return;
    const isCorrect = optionIdx === current.correct_option;
    setSelected(optionIdx);
    setShowResult(true);
    setAiExplanation(null);
    setStats(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1),
    }));
    submitAnswer.mutate({ questionId: current.id, isCorrect, timeTaken: TIMER_SECONDS - timer });
  };

  const nextQuestion = () => {
    if (qIndex + 1 >= filtered.length) {
      navigate(`/bpsc/pyq?topic=${topicFilter}&year=${yearFilter}&month=${monthFilter}`);
      toast({ title: 'Practice complete!', description: `${stats.correct} correct, ${stats.wrong} wrong` });
      return;
    }
    updateQ(qIndex + 1);
  };

  const prevQuestion = () => {
    if (qIndex > 0) updateQ(qIndex - 1);
  };

  const fetchAiExplanation = async () => {
    if (!current) return;
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nqt-explain', {
        body: {
          question: current.question_text,
          options: current.options,
          correctOption: current.correct_option,
          userOption: selected,
          topic: current.topic,
        },
      });
      if (error) throw error;
      setAiExplanation(data?.explanation || 'Could not generate explanation.');
    } catch {
      toast({ title: 'Error', description: 'Failed to get AI explanation.', variant: 'destructive' });
    } finally {
      setAiLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading questions...</div>;
  }

  if (!current) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center space-y-4">
        <p className="text-muted-foreground">No questions found for this filter.</p>
        <Button variant="outline" onClick={() => navigate('/bpsc/pyq')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to PYQ
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(`/bpsc/pyq?topic=${topicFilter}&year=${yearFilter}&month=${monthFilter}`)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to PYQ
        </button>
        <div className="flex items-center gap-2">
          {current.year && <Badge variant="outline" className="text-xs">Year: {current.year}</Badge>}
          <Badge variant="secondary" className="text-xs">{BPSC_TOPIC_META[current.topic]?.icon} {BPSC_TOPIC_META[current.topic]?.label}</Badge>
        </div>
        <div className={cn("flex items-center gap-1 text-sm font-mono font-bold", timer <= 10 ? 'text-destructive' : 'text-muted-foreground')}>
          <Clock className="h-4 w-4" /> {timer}s
        </div>
      </div>

      {/* Progress & Stats */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Q {qIndex + 1} / {filtered.length}</span>
        <span>{stats.correct} correct, {stats.wrong} wrong</span>
      </div>

      {/* Question Card */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <p className="text-lg font-medium text-foreground leading-relaxed">{current.question_text}</p>

          <div className="space-y-3">
            {current.options.map((opt: string, i: number) => {
              const isCorrect = i === current.correct_option;
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium",
                    showResult
                      ? isCorrect ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                        : isSelected ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border text-muted-foreground"
                      : "border-border hover:border-primary/50 hover:bg-accent/50 text-foreground"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                      showResult && isCorrect ? "bg-green-500 text-white border-green-500" :
                      showResult && isSelected ? "bg-destructive text-destructive-foreground border-destructive" :
                      "border-border"
                    )}>
                      {showResult && isCorrect ? <CheckCircle className="h-3.5 w-3.5" /> :
                       showResult && isSelected ? <XCircle className="h-3.5 w-3.5" /> :
                       String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {showResult && current.explanation && (
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Explanation</p>
              <p className="text-sm text-foreground">{current.explanation}</p>
            </div>
          )}

          {showResult && aiExplanation && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> AI Explanation
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{aiExplanation}</p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={prevQuestion} disabled={qIndex === 0} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Prev
            </Button>

            {showResult && !aiExplanation && (
              <Button variant="outline" onClick={fetchAiExplanation} disabled={aiLoading} className="gap-1">
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                AI Explain
              </Button>
            )}

            {showResult ? (
              <Button onClick={nextQuestion} className="flex-1 gap-1">
                {qIndex + 1 >= filtered.length ? 'Finish' : 'Next'} <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" onClick={nextQuestion} className="flex-1 gap-1" disabled={qIndex + 1 >= filtered.length}>
                Skip <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
