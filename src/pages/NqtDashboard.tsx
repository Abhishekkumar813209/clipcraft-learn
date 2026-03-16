import { useNqtTodayStats, useNqtTopicAccuracy } from '@/hooks/useNqtProgress';
import { useNqtQuestionCount } from '@/hooks/useNqtQuestions';
import { NQT_TOPIC_META, NQT_ALL_TOPICS, NQT_SUBJECTS, NQT_SUBJECT_TOPICS, getNqtSubjectForTopic } from '@/types/nqt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, Zap, TrendingUp } from 'lucide-react';

const DAILY_GOAL = 30;

export default function NqtDashboard() {
  const { data: stats } = useNqtTodayStats();
  const { data: topicAccuracy } = useNqtTopicAccuracy();
  const { data: questionCounts } = useNqtQuestionCount();

  const solved = stats?.questions_solved || 0;
  const correct = stats?.correct_count || 0;
  const accuracy = solved > 0 ? Math.round((correct / solved) * 100) : 0;
  const streak = stats?.streak_days || 0;
  const xp = stats?.xp_points || 0;
  const goalPct = Math.min(100, Math.round((solved / DAILY_GOAL) * 100));

  const weakTopics = NQT_ALL_TOPICS.filter((t) => {
    const a = topicAccuracy?.[t];
    return a && a.total >= 3 && (a.correct / a.total) < 0.6;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">TCS NQT Dashboard 💼</h1>
        <p className="text-muted-foreground">Track your preparation progress for TCS National Qualifier Test.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Target className="h-5 w-5 text-primary" />} label="Today's Goal" value={`${solved}/${DAILY_GOAL}`} sub={`${goalPct}% done`} />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-green-500" />} label="Accuracy" value={`${accuracy}%`} sub={`${correct}/${solved} correct`} />
        <StatCard icon={<Flame className="h-5 w-5 text-orange-500" />} label="Streak" value={`${streak} day${streak !== 1 ? 's' : ''}`} sub="Keep it going!" />
        <StatCard icon={<Zap className="h-5 w-5 text-yellow-500" />} label="XP Today" value={`${xp}`} sub="Points earned" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Daily Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={goalPct} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {solved >= DAILY_GOAL ? '🎉 Goal reached! Keep going for bonus XP.' : `${DAILY_GOAL - solved} more questions to reach your daily goal.`}
          </p>
        </CardContent>
      </Card>

      {weakTopics.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-destructive">⚠️ Weak Topics (below 60%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weakTopics.map((t) => {
                const a = topicAccuracy![t]!;
                const pct = Math.round((a.correct / a.total) * 100);
                const subject = getNqtSubjectForTopic(t);
                const subjectMeta = NQT_SUBJECTS.find(s => s.key === subject);
                return (
                  <div key={t} className="flex items-center justify-between">
                    <span className="text-sm">
                      {NQT_TOPIC_META[t].icon} {NQT_TOPIC_META[t].label}
                      <span className="text-xs text-muted-foreground ml-2">({subjectMeta?.label})</span>
                    </span>
                    <span className="text-sm font-medium text-destructive">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {NQT_SUBJECTS.map((subject) => {
        const subTopics = NQT_SUBJECT_TOPICS[subject.key];
        return (
          <Card key={subject.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span>{subject.icon}</span> {subject.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subTopics.map((t) => {
                  const acc = topicAccuracy?.[t];
                  const pct = acc && acc.total > 0 ? Math.round((acc.correct / acc.total) * 100) : null;
                  const count = questionCounts?.[t] || 0;
                  return (
                    <div key={t} className="flex items-center gap-2 p-2 rounded-lg bg-accent/30">
                      <span className="text-lg">{NQT_TOPIC_META[t].icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{NQT_TOPIC_META[t].label}</p>
                        <p className="text-[10px] text-muted-foreground">{count} Qs {pct !== null ? `• ${pct}%` : ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
