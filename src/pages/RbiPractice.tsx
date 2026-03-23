import { useNavigate } from 'react-router-dom';
import { RBI_ALL_TOPICS, RBI_TOPIC_META, RBI_PHASE1_TOPICS, RBI_PHASE2_TOPICS } from '@/types/rbi';
import { useRbiQuestionCount } from '@/hooks/useRbiQuestions';
import { useRbiTopicAccuracy } from '@/hooks/useRbiProgress';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function RbiPractice() {
  const navigate = useNavigate();
  const { data: counts } = useRbiQuestionCount();
  const { data: accuracy } = useRbiTopicAccuracy();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Practice Topics</h1>
        <p className="text-muted-foreground">Choose a subject to start practicing for RBI Grade B.</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Phase 1</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RBI_PHASE1_TOPICS.map((topic) => renderTopicCard(topic, counts, accuracy, navigate))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Phase 2</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RBI_PHASE2_TOPICS.map((topic) => renderTopicCard(topic, counts, accuracy, navigate))}
        </div>
      </div>
    </div>
  );
}

function renderTopicCard(topic: string, counts: Record<string, number> | undefined, accuracy: Record<string, { total: number; correct: number }> | undefined, navigate: (path: string) => void) {
  const meta = RBI_TOPIC_META[topic as keyof typeof RBI_TOPIC_META];
  const count = counts?.[topic] || 0;
  const acc = accuracy?.[topic];
  const pct = acc && acc.total > 0 ? Math.round((acc.correct / acc.total) * 100) : null;

  return (
    <Card
      key={topic}
      className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
      onClick={() => navigate(`/rbi/practice/${topic}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{meta.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{meta.label}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{count} questions</p>
            {pct !== null && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-medium" style={{ color: pct >= 60 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>{pct}%</span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            )}
            {pct === null && (
              <p className="text-xs text-muted-foreground/60 mt-2">Not started yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
          const meta = RBI_TOPIC_META[topic];
          const count = counts?.[topic] || 0;
          const acc = accuracy?.[topic];
          const pct = acc && acc.total > 0 ? Math.round((acc.correct / acc.total) * 100) : null;

          return (
            <Card
              key={topic}
              className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
              onClick={() => navigate(`/rbi/practice/${topic}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{meta.label}</h3>
                    <p className="text-xs text-muted-foreground">{meta.phase}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{count} questions</p>
                    {pct !== null && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Accuracy</span>
                          <span className="font-medium" style={{ color: pct >= 60 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    )}
                    {pct === null && (
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
