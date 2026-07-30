import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion, BookOpenCheck } from 'lucide-react';
import { useRbiQuestionCount } from '@/hooks/useRbiQuestions';

export const RBI_REASONING_TRAINERS = [
  {
    slug: 'sitting-arrangement',
    title: 'Sitting Arrangement — Pattern Trainer',
    subtitle: 'Patterns p21 · Exercise p19',
    file: 'sitting-arrangement.html',
  },
];

export const RBI_TRAINER_BASE = '/trainers/rbi-reasoning/';

export default function RbiReasoning() {
  const nav = useNavigate();
  const { data: counts } = useRbiQuestionCount();
  const count = counts?.['reasoning'] || 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="text-3xl">🧠</span> Reasoning
        </h1>
        <p className="text-muted-foreground">Questions practice karo ya pattern trainer padho.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className={count > 0
            ? 'cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30'
            : 'border-dashed border-border opacity-60'}
          onClick={() => count > 0 && nav('/rbi/practice/reasoning')}
        >
          <CardContent className="p-5 flex items-start gap-3">
            <FileQuestion className="w-7 h-7 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground">Practice Questions</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {count > 0 ? `${count} questions · MCQ practice` : 'Abhi koi question nahi hai'}
              </p>
            </div>
          </CardContent>
        </Card>

        {RBI_REASONING_TRAINERS.map((t) => (
          <Card
            key={t.slug}
            className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
            onClick={() => nav(`/rbi/reasoning/trainer/${t.slug}`)}
          >
            <CardContent className="p-5 flex items-start gap-3">
              <BookOpenCheck className="w-7 h-7 text-primary shrink-0" />
              <div className="min-w-0">
                <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded mb-1.5">
                  Pattern → Method
                </span>
                <h3 className="font-semibold text-foreground truncate">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{t.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
