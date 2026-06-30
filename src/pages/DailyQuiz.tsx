import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Trophy } from 'lucide-react';

interface Book { id: string; name: string; exam_tag: string; }
interface Topic { id: string; book_id: string; name: string; }
interface Subtopic { id: string; topic_id: string; name: string; }
interface Q {
  id: string;
  subtopic_id: string | null;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation: string | null;
}

type Stage = 'pick' | 'quiz' | 'result';

export default function DailyQuiz() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [stage, setStage] = useState<Stage>('pick');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    (async () => {
      const [b, t, s] = await Promise.all([
        supabase.from('admin_books' as never).select('*').order('name'),
        supabase.from('admin_topics' as never).select('*').order('order_index'),
        supabase.from('admin_subtopics' as never).select('*').order('order_index'),
      ]);
      setBooks((b.data as Book[]) || []);
      setTopics((t.data as Topic[]) || []);
      setSubtopics((s.data as Subtopic[]) || []);
    })();
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function startQuiz() {
    if (!selected.size || !user) {
      toast({ title: 'Pick at least one subtopic', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      // Log study
      const logs = Array.from(selected).map((sid) => ({
        user_id: user.id,
        subtopic_id: sid,
        questions_attempted: 0,
      }));
      await supabase.from('admin_study_log' as never).insert(logs as never);

      // Fetch questions
      const { data, error } = await supabase
        .from('admin_questions' as never)
        .select('id,subtopic_id,question_text,options,correct_option,explanation')
        .in('subtopic_id', Array.from(selected))
        .limit(200);
      if (error) throw error;
      const all = ((data as Q[]) || []).sort(() => Math.random() - 0.5).slice(0, 20);
      if (!all.length) {
        toast({ title: 'No questions yet for these subtopics', variant: 'destructive' });
        return;
      }
      setQuestions(all);
      setAnswers({});
      setCurrent(0);
      setStage('quiz');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const score = useMemo(() => {
    return questions.reduce((s, q) => s + (answers[q.id] === q.correct_option ? 1 : 0), 0);
  }, [answers, questions]);

  if (stage === 'pick') {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Daily Quiz
            </h1>
            <p className="text-sm text-muted-foreground">Tick the subtopics you studied today. We'll quiz you on those.</p>
          </div>

          {books.map((book) => {
            const bookTopics = topics.filter((t) => t.book_id === book.id);
            if (!bookTopics.length) return null;
            return (
              <Card key={book.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{book.name}</span>
                    <Badge variant="secondary">{book.exam_tag}</Badge>
                  </div>
                  {bookTopics.map((topic) => {
                    const subs = subtopics.filter((s) => s.topic_id === topic.id);
                    if (!subs.length) return null;
                    return (
                      <div key={topic.id} className="pl-3 border-l-2 border-primary/20 space-y-1">
                        <div className="text-sm font-medium">{topic.name}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {subs.map((s) => (
                            <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
                              <Checkbox checked={selected.has(s.id)} onCheckedChange={() => toggle(s.id)} />
                              {s.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}

          <Button onClick={startQuiz} disabled={loading || !selected.size} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
            Start Quiz ({selected.size} subtopics)
          </Button>
        </div>
      </div>
    );
  }

  if (stage === 'quiz') {
    const q = questions[current];
    const picked = answers[q.id];
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {current + 1} / {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-base whitespace-pre-wrap">{q.question_text}</div>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isPicked = picked === i;
                  const isCorrect = q.correct_option === i;
                  const showResult = picked !== undefined;
                  return (
                    <button
                      key={i}
                      onClick={() => picked === undefined && setAnswers((p) => ({ ...p, [q.id]: i }))}
                      disabled={picked !== undefined}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        showResult && isCorrect
                          ? 'border-green-500 bg-green-500/10'
                          : showResult && isPicked && !isCorrect
                          ? 'border-red-500 bg-red-500/10'
                          : isPicked
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              {picked !== undefined && q.explanation && (
                <div className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                  {q.explanation}
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Previous</Button>
            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent((c) => c + 1)}>Next</Button>
            ) : (
              <Button onClick={() => setStage('result')}>Finish</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Trophy className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <div className="text-4xl font-bold">{score} / {questions.length}</div>
            <div className="text-muted-foreground">
              {Math.round((score / questions.length) * 100)}% correct
            </div>
            <Button onClick={() => { setStage('pick'); setSelected(new Set()); }} className="w-full">
              Take Another Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
