import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, XCircle, MinusCircle, RotateCcw, Target, Loader2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
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

interface UserAnswer {
  questionId: number;
  userAnswer: string;
}

export default function QuizAnalysis() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);

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
      setUserAnswers(((data as any).user_answers as UserAnswer[]) || []);
      setFeedback((data as any).ai_feedback || '');
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId, user]);

  const getUserAnswer = (qId: number): string => {
    return userAnswers.find(a => a.questionId === qId)?.userAnswer || '';
  };

  const getAnswerStatus = (q: QuizQuestion): 'correct' | 'wrong' | 'skipped' => {
    const ua = getUserAnswer(q.id);
    if (!ua || ua === '(skipped)') return 'skipped';
    // Normalize comparison
    const normalize = (s: string) => s.trim().toLowerCase().replace(/[.,;]/g, '');
    if (normalize(ua) === normalize(q.correctAnswer)) return 'correct';
    return 'wrong';
  };

  const correctCount = questions.filter(q => getAnswerStatus(q) === 'correct').length;
  const wrongCount = questions.filter(q => getAnswerStatus(q) === 'wrong').length;
  const skippedCount = questions.filter(q => getAnswerStatus(q) === 'skipped').length;

  const handleRetake = async () => {
    // Clear saved answers
    await supabase
      .from('pdf_saved_quizzes')
      .update({ user_answers: null, ai_feedback: null } as any)
      .eq('id', quizId!);
    navigate(`/quizzes/${quizId}`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusIcon = {
    correct: <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />,
    wrong: <XCircle className="h-5 w-5 text-destructive shrink-0" />,
    skipped: <MinusCircle className="h-5 w-5 text-muted-foreground shrink-0" />,
  };

  const statusBorder = {
    correct: 'border-green-500/30 bg-green-500/5',
    wrong: 'border-destructive/30 bg-destructive/5',
    skipped: 'border-border bg-muted/30',
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/quizzes')} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> My Quizzes
          </Button>
          <div className="hidden sm:block h-5 w-px bg-border" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold truncate max-w-[300px]">{quiz?.name} — Analysis</h1>
            {quiz?.pdf_name && <p className="text-xs text-muted-foreground">{quiz.pdf_name} {quiz.page_range && `· Page ${quiz.page_range}`}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/pdf')} className="gap-1">
            <FileText className="h-4 w-4" /> Back to PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleRetake} className="gap-1">
            <RotateCcw className="h-4 w-4" /> Retake
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {/* Score Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-green-500/30">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Correct</p>
              </CardContent>
            </Card>
            <Card className="border-destructive/30">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-destructive">{wrongCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Wrong</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-muted-foreground">{skippedCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Skipped</p>
              </CardContent>
            </Card>
          </div>

          {/* Score bar */}
          <div className="h-3 rounded-full bg-muted overflow-hidden flex">
            {correctCount > 0 && <div className="bg-green-500 h-full" style={{ width: `${(correctCount / questions.length) * 100}%` }} />}
            {wrongCount > 0 && <div className="bg-destructive h-full" style={{ width: `${(wrongCount / questions.length) * 100}%` }} />}
            {skippedCount > 0 && <div className="bg-muted-foreground/30 h-full" style={{ width: `${(skippedCount / questions.length) * 100}%` }} />}
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const status = getAnswerStatus(q);
              const ua = getUserAnswer(q.id);
              return (
                <Card key={q.id} className={`border ${statusBorder[status]} transition-colors`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {statusIcon[status]}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-muted-foreground">Q{idx + 1}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {q.type === 'mcq' ? 'MCQ' : q.type === 'true_false' ? 'T/F' : q.type === 'fill_blank' ? 'Fill' : q.type === 'multiple_correct' ? 'Multi' : 'Short'}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-medium leading-relaxed">{q.question}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pl-12 space-y-2">
                    {/* Options for MCQ type */}
                    {(q.type === 'mcq' || q.type === 'multiple_correct') && q.options && (
                      <div className="space-y-1.5 mb-3">
                        {q.options.map((opt, oidx) => {
                          const isUserAnswer = ua.includes(opt);
                          const isCorrect = q.correctAnswer.includes(opt);
                          let optClass = 'border-border bg-card';
                          if (isCorrect) optClass = 'border-green-500/50 bg-green-500/10';
                          else if (isUserAnswer && !isCorrect) optClass = 'border-destructive/50 bg-destructive/10';

                          return (
                            <div key={oidx} className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm ${optClass}`}>
                              <span className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0">{String.fromCharCode(65 + oidx)}</span>
                              <span className="flex-1">{opt}</span>
                              {isCorrect && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                              {isUserAnswer && !isCorrect && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* For non-option types */}
                    {q.type !== 'mcq' && q.type !== 'multiple_correct' && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground font-medium shrink-0">Your answer:</span>
                          <span className={status === 'skipped' ? 'italic text-muted-foreground' : status === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-destructive'}>
                            {status === 'skipped' ? 'Skipped' : ua}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground font-medium shrink-0">Correct answer:</span>
                          <span className="text-green-600 dark:text-green-400 font-medium">{q.correctAnswer}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* AI Feedback */}
          {feedback && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weak areas button */}
          {(wrongCount > 0 || skippedCount > 0) && (
            <div className="flex justify-center pb-6">
              <Button variant="outline" onClick={() => navigate('/pdf')} className="gap-2">
                <Target className="h-4 w-4" />
                Back to PDF to Practice Weak Areas
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
