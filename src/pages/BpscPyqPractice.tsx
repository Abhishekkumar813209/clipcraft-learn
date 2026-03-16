import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBpscSubmitAnswer } from '@/hooks/useBpscProgress';
import { BPSC_TOPIC_META, BPSC_ALL_TOPICS, type BpscTopic, type BpscQuestion } from '@/types/bpsc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, XCircle, Clock, Sparkles, Loader2, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TIMER_SECONDS = 60;

export default function BpscPyqPractice() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const submitAnswer = useBpscSubmitAnswer();

  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [practicing, setPracticing] = useState(false);
  const [idx, setIdx] = useState(0);
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

  // Get unique years from data
  const availableYears = useMemo(() => {
    if (!pyqQuestions) return [];
    const years = [...new Set(pyqQuestions.map(q => q.year).filter(Boolean))].sort((a, b) => b - a);
    return years;
  }, [pyqQuestions]);

  // Get topic counts
  const topicCounts = useMemo(() => {
    if (!pyqQuestions) return {};
    const counts: Record<string, number> = {};
    pyqQuestions.forEach(q => {
      counts[q.topic] = (counts[q.topic] || 0) + 1;
    });
    return counts;
  }, [pyqQuestions]);

  // Filtered questions
  const filtered = useMemo(() => {
    if (!pyqQuestions) return [];
    return pyqQuestions.filter(q => {
      if (topicFilter !== 'all' && q.topic !== topicFilter) return false;
      if (yearFilter !== 'all' && q.year !== parseInt(yearFilter)) return false;
      return true;
    }).sort(() => Math.random() - 0.5);
  }, [pyqQuestions, topicFilter, yearFilter]);

  const current = filtered[idx];

  // Timer
  useState(() => {
    if (!practicing || showResult || !current) return;
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
  });

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
    if (idx + 1 >= filtered.length) {
      setPracticing(false);
      return;
    }
    setIdx(i => i + 1);
    setSelected(null);
    setShowResult(false);
    setTimer(TIMER_SECONDS);
    setAiExplanation(null);
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

  const startPractice = () => {
    if (filtered.length === 0) {
      toast({ title: 'No questions', description: 'No PYQ questions match your filters.', variant: 'destructive' });
      return;
    }
    setIdx(0);
    setSelected(null);
    setShowResult(false);
    setTimer(TIMER_SECONDS);
    setStats({ correct: 0, wrong: 0 });
    setPracticing(true);
    setAiExplanation(null);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading PYQ questions...</div>;
  }

  // Practice mode
  if (practicing && current) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setPracticing(false)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            {current.year && <Badge variant="outline" className="text-xs">Year: {current.year}</Badge>}
            <Badge variant="secondary" className="text-xs">{BPSC_TOPIC_META[current.topic]?.icon} {BPSC_TOPIC_META[current.topic]?.label}</Badge>
          </div>
          <div className={cn("flex items-center gap-1 text-sm font-mono font-bold", timer <= 10 ? 'text-destructive' : 'text-muted-foreground')}>
            <Clock className="h-4 w-4" /> {timer}s
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Q {idx + 1} / {filtered.length}</span>
          <span>{stats.correct} correct, {stats.wrong} wrong</span>
        </div>

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
                        : "border-border hover:border-emerald-500/50 hover:bg-accent/50 text-foreground"
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
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-600 mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> AI Explanation
                </p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{aiExplanation}</p>
              </div>
            )}

            {showResult && (
              <div className="flex gap-3">
                {!aiExplanation && (
                  <Button variant="outline" onClick={fetchAiExplanation} disabled={aiLoading} className="gap-1">
                    {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    AI Explain
                  </Button>
                )}
                <Button onClick={nextQuestion} className="flex-1">
                  {idx + 1 >= filtered.length ? 'Finish' : 'Next'} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Browse / filter view
  const totalPyqs = pyqQuestions?.length || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">📋 BPSC PYQ Practice</h1>
          <p className="text-sm text-muted-foreground mt-1">{totalPyqs} previous year questions available</p>
        </div>
        <Button onClick={() => navigate('/bpsc/pyq/upload')} className="gap-2">
          <Upload className="h-4 w-4" /> Upload PYQ PDF
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {BPSC_ALL_TOPICS.map(t => (
                  <SelectItem key={t} value={t}>
                    {BPSC_TOPIC_META[t]?.icon} {BPSC_TOPIC_META[t]?.label} ({topicCounts[t] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map(y => (
                  <SelectItem key={y} value={y!.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-muted-foreground">
              {filtered.length} questions match
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Practice */}
      <Button onClick={startPractice} disabled={filtered.length === 0} size="lg" className="w-full gap-2 text-base">
        Start PYQ Practice ({filtered.length} questions)
      </Button>

      {/* Topic breakdown */}
      {totalPyqs > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BPSC_ALL_TOPICS.filter(t => topicCounts[t]).map(t => (
            <Card key={t} className="cursor-pointer hover:border-emerald-500/50 transition-colors" onClick={() => { setTopicFilter(t); }}>
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-2xl">{BPSC_TOPIC_META[t]?.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{BPSC_TOPIC_META[t]?.label}</p>
                  <p className="text-xs text-muted-foreground">{topicCounts[t]} questions</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPyqs === 0 && (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <p className="text-muted-foreground">No PYQ questions yet. Upload a BPSC question paper PDF to get started.</p>
            <Button variant="outline" onClick={() => navigate('/bpsc/pyq/upload')} className="gap-2">
              <Upload className="h-4 w-4" /> Upload First PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
