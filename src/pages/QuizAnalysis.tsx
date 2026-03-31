import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Loader2, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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

type AnswerStatus = 'correct' | 'incorrect' | 'unattempt';
type FilterTab = 'all' | AnswerStatus;

const normalize = (s: string) => s.trim().toLowerCase().replace(/[.,;]/g, '');

export default function QuizAnalysis() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [practiceLoading, setPracticeLoading] = useState(false);

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

  const getAnswerStatus = (q: QuizQuestion): AnswerStatus => {
    const ua = getUserAnswer(q.id);
    if (!ua || ua === '(skipped)') return 'unattempt';

    if (q.type === 'multiple_correct') {
      const userSet = new Set(ua.split(',').map(s => normalize(s)).filter(Boolean));
      const correctSet = new Set(q.correctAnswer.split(',').map(s => normalize(s)).filter(Boolean));
      if (userSet.size === correctSet.size && [...userSet].every(v => correctSet.has(v))) return 'correct';
      return 'incorrect';
    }

    if (normalize(ua) === normalize(q.correctAnswer)) return 'correct';
    return 'incorrect';
  };

  const correctCount = questions.filter(q => getAnswerStatus(q) === 'correct').length;
  const incorrectCount = questions.filter(q => getAnswerStatus(q) === 'incorrect').length;
  const unattemptCount = questions.filter(q => getAnswerStatus(q) === 'unattempt').length;

  const filteredQuestions = activeTab === 'all'
    ? questions
    : questions.filter(q => getAnswerStatus(q) === activeTab);

  const handleRetake = async () => {
    await supabase
      .from('pdf_saved_quizzes')
      .update({ user_answers: null, ai_feedback: null } as any)
      .eq('id', quizId!);
    navigate(`/quizzes/${quizId}`);
  };

  const handlePracticeWeakAreas = async () => {
    if (!user || !quiz) return;
    setPracticeLoading(true);
    try {
      const weakQuestions = questions.filter(q => {
        const s = getAnswerStatus(q);
        return s === 'incorrect' || s === 'unattempt';
      });

      if (weakQuestions.length === 0) {
        toast.info('No weak areas to practice!');
        setPracticeLoading(false);
        return;
      }

      // Re-index questions
      const reIndexed = weakQuestions.map((q, idx) => ({ ...q, id: idx + 1 }));

      const { data, error } = await supabase
        .from('pdf_saved_quizzes')
        .insert({
          user_id: user.id,
          name: `${quiz.name} — Weak Areas Practice`,
          questions: reIndexed as any,
          pdf_name: quiz.pdf_name,
          page_range: quiz.page_range,
          language: quiz.language || 'english',
          folder_id: quiz.folder_id,
        } as any)
        .select('id')
        .single();

      if (error || !data) throw error;
      toast.success(`Practice quiz created with ${weakQuestions.length} questions`);
      navigate(`/quizzes/${data.id}`);
    } catch {
      toast.error('Failed to create practice quiz');
    }
    setPracticeLoading(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabConfig = [
    { key: 'correct' as FilterTab, label: 'Correct', count: correctCount, bg: 'bg-green-500', activeBg: 'bg-green-500 text-white', inactiveBg: 'bg-gray-100 text-gray-500 hover:bg-gray-200' },
    { key: 'incorrect' as FilterTab, label: 'In-Correct', count: incorrectCount, bg: 'bg-red-500', activeBg: 'bg-red-500 text-white', inactiveBg: 'bg-gray-100 text-gray-500 hover:bg-gray-200' },
    { key: 'unattempt' as FilterTab, label: 'Unattempt', count: unattemptCount, bg: 'bg-amber-500', activeBg: 'bg-amber-500 text-white', inactiveBg: 'bg-gray-100 text-gray-500 hover:bg-gray-200' },
  ];

  const statusConfig: Record<AnswerStatus, { label: string; borderColor: string; badgeBg: string; badgeText: string; icon: React.ReactNode }> = {
    correct: {
      label: 'Correct',
      borderColor: 'border-l-green-500',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-700',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    incorrect: {
      label: 'Incorrect',
      borderColor: 'border-l-red-500',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-700',
      icon: <XCircle className="h-4 w-4 text-red-500" />,
    },
    unattempt: {
      label: 'Unattempt',
      borderColor: 'border-l-amber-500',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-700',
      icon: <MinusCircle className="h-4 w-4 text-amber-500" />,
    },
  };

  // Get the original question index
  const getOriginalIndex = (q: QuizQuestion) => questions.findIndex(oq => oq.id === q.id);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-background">
      {/* Top Bar */}
      <div className="border-b bg-white dark:bg-card px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/quizzes')} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> My Quizzes
          </Button>
          <div className="hidden sm:block h-5 w-px bg-gray-200 dark:bg-border" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold truncate max-w-[300px]">{quiz?.name} — Analysis</h1>
            {quiz?.pdf_name && <p className="text-xs text-muted-foreground">{quiz.pdf_name} {quiz.page_range && `· Page ${quiz.page_range}`}</p>}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRetake} className="gap-1">
          <RotateCcw className="h-4 w-4" /> Retake
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
          {/* Score Summary Bar */}
          <div className="bg-white dark:bg-card rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Score: {correctCount}/{questions.length}</span>
              <span className="text-xs text-muted-foreground">{Math.round((correctCount / questions.length) * 100)}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 dark:bg-muted overflow-hidden flex">
              {correctCount > 0 && <div className="bg-green-500 h-full transition-all" style={{ width: `${(correctCount / questions.length) * 100}%` }} />}
              {incorrectCount > 0 && <div className="bg-red-500 h-full transition-all" style={{ width: `${(incorrectCount / questions.length) * 100}%` }} />}
              {unattemptCount > 0 && <div className="bg-amber-400 h-full transition-all" style={{ width: `${(unattemptCount / questions.length) * 100}%` }} />}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {tabConfig.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(activeTab === tab.key ? 'all' : tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.key ? tab.activeBg : tab.inactiveBg
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const status = getAnswerStatus(q);
              const config = statusConfig[status];
              const ua = getUserAnswer(q.id);
              const origIdx = getOriginalIndex(q);

              return (
                <div key={q.id} className={`bg-white dark:bg-card rounded-xl border border-l-4 ${config.borderColor} shadow-sm overflow-hidden`}>
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-border">
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeText}`}>
                        Q.{origIdx + 1} {config.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-muted text-muted-foreground font-medium">
                        {q.type === 'mcq' ? 'MCQ' : q.type === 'true_false' ? 'T/F' : q.type === 'fill_blank' ? 'Fill' : q.type === 'multiple_correct' ? 'Multi' : 'Short'}
                      </span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium leading-relaxed">{q.question}</p>
                  </div>

                  {/* Options for MCQ / Multiple Correct */}
                  {(q.type === 'mcq' || q.type === 'multiple_correct') && q.options && (
                    <div className="px-4 pb-3 space-y-2">
                      {q.options.map((opt, oidx) => {
                        const isUserAnswer = q.type === 'multiple_correct'
                          ? ua.split(',').map(s => normalize(s)).includes(normalize(opt))
                          : normalize(ua) === normalize(opt);
                        const isCorrect = q.type === 'multiple_correct'
                          ? q.correctAnswer.split(',').map(s => normalize(s)).includes(normalize(opt))
                          : normalize(q.correctAnswer) === normalize(opt);

                        let optBg = 'bg-gray-50 dark:bg-muted/30 border-gray-200 dark:border-border';
                        if (isCorrect) optBg = 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
                        else if (isUserAnswer && !isCorrect) optBg = 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';

                        return (
                          <div key={oidx} className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${optBg}`}>
                            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0">
                              {String.fromCharCode(65 + oidx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                            {isUserAnswer && !isCorrect && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* For non-option types: show answers inline */}
                  {q.type !== 'mcq' && q.type !== 'multiple_correct' && (
                    <div className="px-4 pb-3 space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground font-medium shrink-0">Your answer:</span>
                        <span className={status === 'unattempt' ? 'italic text-amber-500' : status === 'correct' ? 'text-green-600' : 'text-red-500'}>
                          {status === 'unattempt' ? 'Not attempted' : ua}
                        </span>
                      </div>
                      {status !== 'correct' && (
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground font-medium shrink-0">Correct answer:</span>
                          <span className="text-green-600 font-medium">{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* For MCQ: show correct answer text when user got it wrong or skipped */}
                  {(q.type === 'mcq' || q.type === 'multiple_correct') && status !== 'correct' && (
                    <div className="px-4 pb-3">
                      <div className="flex items-start gap-2 text-sm bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5 border border-green-200 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-green-700 dark:text-green-400 font-medium">Correct: {q.correctAnswer}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Practice Weak Areas */}
          {(incorrectCount > 0 || unattemptCount > 0) && (
            <div className="flex justify-center pb-6">
              <Button
                onClick={handlePracticeWeakAreas}
                disabled={practiceLoading}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
              >
                {practiceLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Practice Weak Areas ({incorrectCount + unattemptCount} Questions)
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
