import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NQT_SUBJECTS, NQT_SUBJECT_TOPICS, NQT_TOPIC_META, type NqtSubject } from '@/types/nqt';
import { useNqtQuestionCount } from '@/hooks/useNqtQuestions';
import { useNqtTopicAccuracy } from '@/hooks/useNqtProgress';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function NqtPractice() {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState<NqtSubject>('aptitude');
  const { data: counts } = useNqtQuestionCount();
  const { data: accuracy } = useNqtTopicAccuracy();

  const topics = NQT_SUBJECT_TOPICS[activeSubject];
  const subjectMeta = NQT_SUBJECTS.find(s => s.key === activeSubject)!;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Practice Topics</h1>
        <p className="text-muted-foreground">Choose a section and topic to start practicing for TCS NQT.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {NQT_SUBJECTS.map((subject) => (
          <button
            key={subject.key}
            onClick={() => setActiveSubject(subject.key)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
              activeSubject === subject.key
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/30 hover:bg-accent/50"
            )}
          >
            <span className="text-2xl">{subject.icon}</span>
            <div>
              <p className={cn("text-sm font-semibold", activeSubject === subject.key ? "text-primary" : "text-foreground")}>
                {subject.label}
              </p>
              <p className="text-xs text-muted-foreground">{NQT_SUBJECT_TOPICS[subject.key].length} topics</p>
            </div>
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span>{subjectMeta.icon}</span> {subjectMeta.label}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => {
            const meta = NQT_TOPIC_META[topic];
            const count = counts?.[topic] || 0;
            const acc = accuracy?.[topic];
            const pct = acc && acc.total > 0 ? Math.round((acc.correct / acc.total) * 100) : null;

            return (
              <Card
                key={topic}
                className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
                onClick={() => navigate(`/nqt/practice/${topic}`)}
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
          })}
        </div>
      </div>
    </div>
  );
}
