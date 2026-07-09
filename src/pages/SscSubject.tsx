import { useNavigate, useLocation } from 'react-router-dom';
import { SSC_SUBJECTS, SUBJECT_TOPICS, TOPIC_META, type SscSubject } from '@/types/ssc';
import { useSscQuestionCount } from '@/hooks/useSscQuestions';
import { useSscTopicAccuracy } from '@/hooks/useSscProgress';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const SLUG_TO_SUBJECT: Record<string, SscSubject> = {
  english: 'english',
  maths: 'quant',
  quant: 'quant',
  reasoning: 'reasoning',
  gk: 'gk',
};

export default function SscSubjectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).pop() ?? '';
  const subject: SscSubject = SLUG_TO_SUBJECT[slug] ?? 'english';
  const { data: counts } = useSscQuestionCount();
  const { data: accuracy } = useSscTopicAccuracy();

  const meta = SSC_SUBJECTS.find(s => s.key === subject)!;
  const topics = SUBJECT_TOPICS[subject];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="text-3xl">{meta.icon}</span> {meta.label}
        </h1>
        <p className="text-muted-foreground">Pick a topic to start practicing.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => {
          const t = TOPIC_META[topic];
          const count = counts?.[topic] || 0;
          const acc = accuracy?.[topic];
          const pct = acc && acc.total > 0 ? Math.round((acc.correct / acc.total) * 100) : null;

          return (
            <Card
              key={topic}
              className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
              onClick={() => navigate(`/ssc/practice/${topic}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{t.label}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{count} questions</p>
                    {pct !== null ? (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Accuracy</span>
                          <span className="font-medium" style={{ color: pct >= 60 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground/60 mt-2">Not started yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
