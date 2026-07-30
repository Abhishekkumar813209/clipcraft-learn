import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileQuestion, BookOpenCheck } from 'lucide-react';
import { TOPIC_META, type SscTopic } from '@/types/ssc';
import { useSscQuestionCount } from '@/hooks/useSscQuestions';
import { trainersForTopic } from '@/data/mathsTrainers';

export default function SscMathsTopicHub() {
  const nav = useNavigate();
  const { topic } = useParams<{ topic: string }>();
  const meta = topic ? TOPIC_META[topic as SscTopic] : undefined;
  const { data: counts } = useSscQuestionCount();
  const count = counts?.[topic || ''] || 0;
  const trainers = trainersForTopic(topic || '');

  if (!meta) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-muted-foreground">Topic nahi mila.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => nav('/ssc/maths')}>
        <ArrowLeft className="w-4 h-4 mr-1" />Back to Maths
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="text-3xl">{meta.icon}</span> {meta.label}
        </h1>
        <p className="text-muted-foreground">Questions practice karo ya pattern trainer padho.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className={count > 0
            ? 'cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30'
            : 'border-dashed border-border opacity-60'}
          onClick={() => count > 0 && nav(`/ssc/practice/${topic}`)}
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

        {trainers.length === 0 ? (
          <Card className="border-dashed border-border opacity-60">
            <CardContent className="p-5 flex items-start gap-3">
              <BookOpenCheck className="w-7 h-7 text-muted-foreground shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Pattern Trainer</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Coming soon</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          trainers.map((t) => (
            <Card
              key={t.slug}
              className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
              onClick={() => nav(`/ssc/maths/${topic}/trainer/${t.slug}`)}
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
          ))
        )}
      </div>
    </div>
  );
}
