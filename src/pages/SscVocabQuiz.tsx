import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import {
  VOCABULARY, SECTION_TREE,
  filterWords, pickDistractorMeanings,
  type VocabularyWord,
} from '@/data/vocabulary';

type QuizQ = {
  word: VocabularyWord;
  options: string[];        // 4 meanings, shuffled
  correct: string;          // word.meaning
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz(pool: VocabularyWord[], count: number): QuizQ[] {
  const picked = shuffle(pool).slice(0, count);
  return picked.map(w => {
    const distractors = pickDistractorMeanings(w, 3);
    return { word: w, correct: w.meaning, options: shuffle([w.meaning, ...distractors]) };
  });
}

export default function SscVocabQuiz() {
  const navigate = useNavigate();

  const [section, setSection] = useState<string | null>(null);
  const [top500Only, setTop500Only] = useState(true);
  const [count, setCount] = useState<10 | 20 | 50>(10);

  const [questions, setQuestions] = useState<QuizQ[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);

  const pool = useMemo(
    () => filterWords({ section, top500Only }).filter(w => w.meaning && w.meaning.length > 4),
    [section, top500Only]
  );

  const start = () => {
    if (pool.length < 4) return;
    setQuestions(buildQuiz(pool, Math.min(count, pool.length)));
    setIdx(0);
    setAnswers({});
    setFinished(false);
  };

  const reset = () => {
    setQuestions(null);
    setIdx(0);
    setAnswers({});
    setFinished(false);
  };

  // ── Setup screen ──
  if (!questions) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ssc/vocab')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Vocabulary Quiz</h1>
            <p className="text-xs text-muted-foreground">Pick a section and length — no AI calls, instant.</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-5 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Section</p>
              <div className="flex flex-wrap gap-1.5">
                <FilterPill active={section === null} onClick={() => setSection(null)}>All</FilterPill>
                {SECTION_TREE.map(s => (
                  <FilterPill key={s.section} active={section === s.section} onClick={() => setSection(s.section)}>
                    {s.section} <span className="text-[10px] opacity-70">({s.total})</span>
                  </FilterPill>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Difficulty filter</p>
              <div className="flex gap-1.5">
                <FilterPill active={top500Only} onClick={() => setTop500Only(true)}>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline mr-1" /> Top 500 only
                </FilterPill>
                <FilterPill active={!top500Only} onClick={() => setTop500Only(false)}>All words</FilterPill>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Questions</p>
              <div className="flex gap-1.5">
                {[10, 20, 50].map(n => (
                  <FilterPill key={n} active={count === n} onClick={() => setCount(n as 10 | 20 | 50)}>
                    {n}
                  </FilterPill>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="text-xs text-muted-foreground">
                {pool.length.toLocaleString()} words available
              </span>
              <Button onClick={start} disabled={pool.length < 4}>Start Quiz</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Results screen ──
  if (finished) {
    const correctCount = questions.reduce(
      (n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0
    );
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={reset}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Results</h1>
        </div>

        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <Trophy className="h-12 w-12 mx-auto text-amber-500" />
            <p className="text-3xl font-bold">
              {correctCount} <span className="text-muted-foreground text-xl">/ {questions.length}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {Math.round((correctCount / questions.length) * 100)}% accuracy
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <Button variant="outline" onClick={reset}>New Quiz</Button>
              <Button onClick={start}><RotateCcw className="h-4 w-4 mr-1" /> Try Again</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {questions.map((q, i) => {
            const picked = answers[i];
            const correct = picked === q.correct;
            return (
              <Card key={i} className={correct ? 'border-green-500/30' : 'border-red-500/30'}>
                <CardContent className="p-3 text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    {correct
                      ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                      : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="font-semibold">{q.word.word}</span>
                    {q.word.is_top500 && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                    {q.word.ssc_frequency != null && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono">#{q.word.ssc_frequency}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">✓ {q.correct}</p>
                  {!correct && picked && <p className="text-xs text-red-600 dark:text-red-400">✗ {picked}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Question screen ──
  const q = questions[idx];
  const picked = answers[idx];
  const revealed = picked != null;

  const choose = (opt: string) => {
    if (revealed) return;
    setAnswers(prev => ({ ...prev, [idx]: opt }));
  };

  const next = () => {
    if (idx < questions.length - 1) setIdx(idx + 1);
    else setFinished(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={reset}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Question {idx + 1} of {questions.length}</p>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((idx + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-3xl font-bold tracking-tight">{q.word.word}</h2>
              {q.word.is_top500 && <Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
            </div>
            {q.word.ssc_frequency != null && (
              <Badge variant="outline" className="text-[10px] font-mono">SSC #{q.word.ssc_frequency}</Badge>
            )}
            <p className="text-xs text-muted-foreground">Pick the correct meaning</p>
          </div>

          <div className="space-y-2">
            {q.options.map(opt => {
              const isCorrect = opt === q.correct;
              const isPicked = picked === opt;
              let cls = 'w-full text-left p-3 rounded-lg border-2 text-sm transition-all ';
              if (revealed) {
                if (isCorrect) cls += 'bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-400';
                else if (isPicked) cls += 'bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-400';
                else cls += 'border-border/40 text-muted-foreground opacity-60';
              } else {
                cls += 'border-border/40 hover:border-primary/50 hover:bg-primary/5 cursor-pointer';
              }
              return (
                <button key={opt} className={cls} onClick={() => choose(opt)}>
                  <span className="flex items-start gap-2">
                    {revealed && isCorrect && <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
                    {revealed && isPicked && !isCorrect && <XCircle className="h-4 w-4 mt-0.5 shrink-0" />}
                    <span>{opt}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {revealed && (
            <Button className="w-full" onClick={next}>
              {idx < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FilterPill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
      }`}
    >
      {children}
    </button>
  );
}
