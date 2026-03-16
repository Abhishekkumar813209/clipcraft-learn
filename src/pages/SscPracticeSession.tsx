import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSscQuestions } from '@/hooks/useSscQuestions';
import { useSubmitAnswer } from '@/hooks/useSscProgress';
import { TOPIC_META, type SscTopic, type SscQuestion } from '@/types/ssc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';

const TIMER_SECONDS = 30;

export default function SscPracticeSession() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const { data: questions, isLoading } = useSscQuestions(topic as SscTopic);
  const submitAnswer = useSubmitAnswer();

  const shuffled = useMemo(() => {
    if (!questions) return [];
    return [...questions].sort(() => Math.random() - 0.5);
  }, [questions]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, totalTime: 0 });
  const [finished, setFinished] = useState(false);

  const current: SscQuestion | undefined = shuffled[idx];
  const meta = TOPIC_META[topic as SscTopic];

  // Timer
  useEffect(() => {
    if (showResult || finished || !current) return;
    if (timer <= 0) {
      handleAnswer(-1); // time up = wrong
      return;
    }
    const t = setTimeout(() => setTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, showResult, finished, current]);

  const handleAnswer = useCallback((optionIdx: number) => {
    if (showResult || !current) return;
    const isCorrect = optionIdx === current.correct_option;
    const timeTaken = TIMER_SECONDS - timer;
    setSelected(optionIdx);
    setShowResult(true);
    setSessionStats((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1),
      totalTime: s.totalTime + timeTaken,
    }));
    submitAnswer.mutate({ questionId: current.id, isCorrect, timeTaken });
  }, [showResult, current, timer, submitAnswer]);

  const nextQuestion = () => {
    if (idx + 1 >= shuffled.length) {
      setFinished(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setShowResult(false);
    setTimer(TIMER_SECONDS);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading questions...</div>;
  }

  if (!meta || shuffled.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">No questions found for this topic.</p>
        <Button variant="outline" onClick={() => navigate('/ssc/practice')}>Back to Practice</Button>
      </div>
    );
  }

  if (finished) {
    const total = sessionStats.correct + sessionStats.wrong;
    const accuracy = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <span className="text-5xl">{accuracy >= 70 ? '🎉' : accuracy >= 40 ? '💪' : '📚'}</span>
            <h2 className="text-2xl font-bold text-foreground">Session Complete!</h2>
            <p className="text-muted-foreground">{meta.icon} {meta.label}</p>
            <div className="grid grid-cols-3 gap-4 py-4">
              <div>
                <p className="text-2xl font-bold text-primary">{sessionStats.correct}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{sessionStats.wrong}</p>
                <p className="text-xs text-muted-foreground">Wrong</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Time spent: {Math.round(sessionStats.totalTime / 60)}m {sessionStats.totalTime % 60}s</p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/ssc/practice')}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Topics
              </Button>
              <Button className="flex-1" onClick={() => {
                setIdx(0); setSelected(null); setShowResult(false);
                setTimer(TIMER_SECONDS); setSessionStats({ correct: 0, wrong: 0, totalTime: 0 });
                setFinished(false);
              }}>
                Practice Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/ssc/practice')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-sm font-medium">{meta.icon} {meta.label}</span>
        <div className={cn("flex items-center gap-1 text-sm font-mono font-bold", timer <= 10 ? 'text-destructive' : 'text-muted-foreground')}>
          <Clock className="h-4 w-4" /> {timer}s
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Question {idx + 1} of {shuffled.length}</span>
          <span>{sessionStats.correct} correct</span>
        </div>
        <Progress value={((idx + 1) / shuffled.length) * 100} className="h-2" />
      </div>

      {/* Question */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <p className="text-lg font-medium text-foreground leading-relaxed">{current.question_text}</p>

          <div className="space-y-3">
            {current.options.map((opt, i) => {
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
                      ? isCorrect
                        ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                        : isSelected
                        ? "border-destructive bg-destructive/10 text-destructive"
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

          {/* Explanation */}
          {showResult && current.explanation && (
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Explanation</p>
              <p className="text-sm text-foreground">{current.explanation}</p>
            </div>
          )}

          {showResult && (
            <Button onClick={nextQuestion} className="w-full">
              {idx + 1 >= shuffled.length ? 'Finish Session' : 'Next Question'} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
