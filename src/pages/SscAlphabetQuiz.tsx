import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type Q = {
  prompt: string;
  options: string[];
  correct: number;
  answerNote: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pos(letter: string, reverse: boolean) {
  const p = LETTERS.indexOf(letter) + 1;
  return reverse ? 27 - p : p;
}

function buildQuestions(count: number, reverse: boolean): Q[] {
  const pool = shuffle(LETTERS);
  const qs: Q[] = [];
  for (let i = 0; i < count; i++) {
    const letter = pool[i % 26];
    const value = pos(letter, reverse);
    const askLetterToNumber = Math.random() < 0.6;

    if (askLetterToNumber) {
      const distractors = new Set<number>();
      while (distractors.size < 3) {
        const d = value + (Math.floor(Math.random() * 9) - 4);
        if (d >= 1 && d <= 26 && d !== value) distractors.add(d);
      }
      const opts = shuffle([value, ...distractors]).map(String);
      qs.push({
        prompt: reverse
          ? `Reverse order (A = 26) me "${letter}" ka number kya hai?`
          : `"${letter}" ka position number kya hai? (A = 1)`,
        options: opts,
        correct: opts.indexOf(String(value)),
        answerNote: `${letter} = ${value}${reverse ? ' (reverse)' : ''}`,
      });
    } else {
      const distractors = new Set<string>();
      while (distractors.size < 3) {
        const d = LETTERS[Math.floor(Math.random() * 26)];
        if (d !== letter) distractors.add(d);
      }
      const opts = shuffle([letter, ...distractors]);
      qs.push({
        prompt: reverse
          ? `Reverse order (A = 26) me number ${value} kis letter ka hai?`
          : `Position number ${value} kis letter ka hai? (A = 1)`,
        options: opts,
        correct: opts.indexOf(letter),
        answerNote: `${value} = ${letter}${reverse ? ' (reverse)' : ''}`,
      });
    }
  }
  return qs;
}

export default function SscAlphabetQuiz() {
  const nav = useNavigate();
  const { mode = 'forward' } = useParams();
  const reverse = mode === 'reverse';

  const [countInput, setCountInput] = useState('20');
  const [started, setStarted] = useState(false);
  const [seed, setSeed] = useState(0);
  const [total, setTotal] = useState(20);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const questions = useMemo(
    () => (started ? buildQuestions(total, reverse) : []),
    [started, total, reverse, seed],
  );

  const start = () => {
    const n = Math.max(1, Math.min(100, parseInt(countInput) || 20));
    setTotal(n);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setSeed((s) => s + 1);
    setStarted(true);
  };

  const title = reverse ? 'Reverse Order (A = 26)' : 'Alphabet Position (A = 1)';

  if (!started) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english/practice/alphabet')} className="text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">Kitne questions practice karne hain?</p>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of questions (1-100)</label>
              <Input value={countInput} onChange={(e) => setCountInput(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
            </div>
            <Button className="w-full" onClick={start}>Start Practice</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (idx >= questions.length) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Session complete 🎉</h1>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-lg">Score: <span className="font-bold text-emerald-600">{score}</span> / {questions.length}</div>
            <div className="flex gap-3">
              <Button onClick={start}><RotateCcw className="w-4 h-4 mr-1" />Retry</Button>
              <Button variant="outline" onClick={() => setStarted(false)}>Change count</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = questions[idx];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setScore((s) => s + 1);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setStarted(false)} className="text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" />Exit
        </Button>
        <div className="text-sm text-muted-foreground">{idx + 1} / {questions.length} · Score {score}</div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">{q.prompt}</h2>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const state = picked === null ? '' : isCorrect
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                : i === picked ? 'border-red-400 bg-red-50 text-red-700' : 'opacity-60';
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  className={`p-4 rounded-lg border text-lg font-semibold transition-colors hover:border-emerald-400 ${state}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">✅ {q.answerNote}</div>
              <Button onClick={() => { setIdx((i) => i + 1); setPicked(null); }} className="w-full">
                {idx + 1 === questions.length ? 'Finish' : 'Next'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
