import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Flag, ChevronLeft, ChevronRight, Loader2, CheckCircle, FileText, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface QuizQuestion {
  id: number;
  question: string;
  type: 'mcq' | 'short' | 'true_false' | 'fill_blank' | 'multiple_correct';
  options?: string[];
  correctAnswer: string;
}

type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked' | 'answered-marked';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-chat`;

export default function QuizTest() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  const [multiAnswers, setMultiAnswers] = useState<Map<number, Set<string>>>(new Map());
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Fast Mode state
  const [fastMode, setFastMode] = useState(false);
  const [fastModeSeconds, setFastModeSeconds] = useState(30);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const fastModeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId || !user) return;
      const { data, error } = await supabase
        .from('pdf_saved_quizzes')
        .select('*')
        .eq('id', quizId)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        toast.error('Quiz not found');
        navigate('/quizzes');
        return;
      }
      setQuiz(data);
      setQuestions((data.questions as any) || []);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId, user]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getAnswerForQuestion = (q: QuizQuestion): string => {
    if (q.type === 'multiple_correct') {
      return Array.from(multiAnswers.get(q.id) || []).join(', ');
    }
    return answers.get(q.id) || '';
  };

  const isQuestionAnswered = (q: QuizQuestion): boolean => {
    if (q.type === 'multiple_correct') return (multiAnswers.get(q.id)?.size || 0) > 0;
    return !!answers.get(q.id);
  };

  const getQuestionStatus = (idx: number): QuestionStatus => {
    const q = questions[idx];
    if (!q) return 'not-visited';
    const answered = isQuestionAnswered(q);
    const marked = markedForReview.has(q.id);
    const visited = visitedQuestions.has(idx);

    if (answered && marked) return 'answered-marked';
    if (marked) return 'marked';
    if (answered) return 'answered';
    if (visited) return 'not-answered';
    return 'not-visited';
  };

  const statusColors: Record<QuestionStatus, string> = {
    'not-visited': 'bg-muted text-muted-foreground border-border',
    'not-answered': 'bg-destructive/20 text-destructive border-destructive/40',
    'answered': 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/40',
    'marked': 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/40',
    'answered-marked': 'bg-teal-500/20 text-teal-700 dark:text-teal-400 border-teal-500/40',
  };

  const setAnswer = (qId: number, value: string) => {
    setAnswers(prev => new Map(prev).set(qId, value));
  };

  const toggleMultiAnswer = (qId: number, value: string) => {
    setMultiAnswers(prev => {
      const next = new Map(prev);
      const current = new Set(next.get(qId) || []);
      current.has(value) ? current.delete(value) : current.add(value);
      next.set(qId, current);
      return next;
    });
  };

  const clearAnswer = () => {
    const q = questions[currentIndex];
    if (!q) return;
    if (q.type === 'multiple_correct') {
      setMultiAnswers(prev => { const n = new Map(prev); n.delete(q.id); return n; });
    } else {
      setAnswers(prev => { const n = new Map(prev); n.delete(q.id); return n; });
    }
  };

  const toggleMark = () => {
    const q = questions[currentIndex];
    if (!q) return;
    setMarkedForReview(prev => {
      const n = new Set(prev);
      n.has(q.id) ? n.delete(q.id) : n.add(q.id);
      return n;
    });
  };

  const goToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setVisitedQuestions(prev => new Set(prev).add(idx));
  };

  const answeredCount = questions.filter(q => isQuestionAnswered(q)).length;

  const handleSubmit = async () => {
    setShowSubmitDialog(false);
    if (answeredCount === 0) {
      toast.error('Please answer at least one question');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = questions.map(q => ({
        questionId: q.id,
        question: q.question,
        correctAnswer: q.correctAnswer,
        userAnswer: getAnswerForQuestion(q) || '(skipped)',
      }));

      const userAnswersData = questions.map(q => ({
        questionId: q.id,
        userAnswer: getAnswerForQuestion(q) || '(skipped)',
      }));

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: 'check-answers', pageText: '', language: quiz.language || 'english', answers: payload }),
      });

      if (!resp.ok) throw new Error('Failed to check answers');
      const data = await resp.json();

      await supabase
        .from('pdf_saved_quizzes')
        .update({ user_answers: userAnswersData as any, ai_feedback: data.feedback } as any)
        .eq('id', quizId!);

      toast.success('Test submitted!');
      navigate(`/quizzes/${quizId}/analysis`);
    } catch {
      toast.error('Failed to submit test');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const renderQuestionInput = (q: QuizQuestion) => {
    switch (q.type) {
      case 'true_false':
        return (
          <div className="space-y-3 mt-6">
            {['True', 'False'].map(opt => (
              <label key={opt} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${answers.get(q.id) === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 bg-card'}`}>
                <input type="radio" name={`q-${q.id}`} value={opt} checked={answers.get(q.id) === opt} onChange={() => setAnswer(q.id, opt)} className="accent-primary w-4 h-4" />
                <span className="text-sm font-medium">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'fill_blank':
        return (
          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-2 italic">Fill in the blank(s)</p>
            <input type="text" placeholder="Type your answer..." value={answers.get(q.id) || ''} onChange={e => setAnswer(q.id, e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
        );
      case 'multiple_correct':
        return (
          <div className="space-y-3 mt-6">
            <p className="text-xs text-muted-foreground italic">Select all that apply</p>
            {q.options?.map((opt, idx) => {
              const selected = multiAnswers.get(q.id)?.has(opt) || false;
              return (
                <label key={idx} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${selected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 bg-card'}`}>
                  <input type="checkbox" checked={selected} onChange={() => toggleMultiAnswer(q.id, opt)} className="accent-primary w-4 h-4" />
                  <span className="text-sm">{opt}</span>
                </label>
              );
            })}
          </div>
        );
      case 'mcq':
        return (
          <div className="space-y-3 mt-6">
            {q.options?.map((opt, idx) => (
              <label key={idx} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${answers.get(q.id) === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 bg-card'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${answers.get(q.id) === opt ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'short':
      default:
        return (
          <div className="mt-6">
            <textarea placeholder="Type your answer..." value={answers.get(q.id) || ''} onChange={e => setAnswer(q.id, e.target.value)} rows={4}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none" />
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/pdf')} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to PDF
          </Button>
          <div className="hidden sm:block h-5 w-px bg-border" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold truncate max-w-[300px]">{quiz?.name}</h1>
            {quiz?.pdf_name && <p className="text-xs text-muted-foreground">{quiz.pdf_name} {quiz.page_range && `· Page ${quiz.page_range}`}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(elapsedSeconds)}</span>
          </div>
          <Button onClick={() => setShowSubmitDialog(true)} disabled={isSubmitting} className="gap-1.5">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Submit Test
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-2xl mx-auto">
              {/* Question Header */}
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  Question {currentIndex + 1} of {questions.length}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {currentQ?.type === 'mcq' ? 'MCQ' : currentQ?.type === 'true_false' ? 'True/False' : currentQ?.type === 'fill_blank' ? 'Fill Blank' : currentQ?.type === 'multiple_correct' ? 'Multi-Select' : 'Short Answer'}
                </Badge>
                {markedForReview.has(currentQ?.id) && (
                  <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/40 text-xs">Marked for Review</Badge>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-lg font-medium leading-relaxed mt-4">
                {currentQ?.question}
              </h2>

              {/* Answer Options */}
              {currentQ && renderQuestionInput(currentQ)}
            </div>
          </ScrollArea>

          {/* Bottom Controls */}
          <div className="border-t border-border p-4 flex items-center justify-between bg-card shrink-0">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearAnswer} className="gap-1">
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </Button>
              <Button variant={markedForReview.has(currentQ?.id) ? 'default' : 'outline'} size="sm" onClick={toggleMark} className="gap-1">
                <Flag className="h-3.5 w-3.5" /> {markedForReview.has(currentQ?.id) ? 'Unmark' : 'Mark for Review'}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentIndex === 0} onClick={() => goToQuestion(currentIndex - 1)} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={currentIndex === questions.length - 1} onClick={() => goToQuestion(currentIndex + 1)} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="w-72 border-l border-border bg-card/50 hidden md:flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Question Palette</h3>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                const status = getQuestionStatus(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`w-10 h-10 rounded-lg border text-xs font-bold flex items-center justify-center transition-all hover:scale-105 ${statusColors[status]} ${currentIndex === idx ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Legend */}
          <div className="p-4 border-t border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border ${statusColors['answered']}`} />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border ${statusColors['not-answered']}`} />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border ${statusColors['not-visited']}`} />
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border ${statusColors['marked']}`} />
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border ${statusColors['answered-marked']}`} />
                <span>Answered & Marked</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border mt-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{answeredCount}</span>/{questions.length} answered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered <span className="font-semibold text-foreground">{answeredCount}</span> out of <span className="font-semibold text-foreground">{questions.length}</span> questions.
              {answeredCount < questions.length && ` ${questions.length - answeredCount} question(s) will be marked as skipped.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
