import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RBI_TOPIC_META, RBI_ALL_TOPICS, RBI_SUBJECTS, RBI_SUBJECT_TOPICS, type RbiTopic } from '@/types/rbi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Upload } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DIFFICULTY_COLORS = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' };
const SUBJECT_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];

export default function RbiPyqAnalysis() {
  const navigate = useNavigate();

  const { data: pyqQuestions, isLoading } = useQuery({
    queryKey: ['rbi-pyq-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ssc_questions')
        .select('*')
        .eq('is_pyq', true)
        .eq('exam', 'RBI' as any)
        .in('topic', [...RBI_ALL_TOPICS] as any);
      if (error) throw error;
      return (data || []).map((q: any) => ({
        topic: q.topic as RbiTopic,
        difficulty: q.difficulty as string,
        year: q.year as number | null,
      }));
    },
  });

  const years = useMemo(() => {
    if (!pyqQuestions) return [];
    return [...new Set(pyqQuestions.map(q => q.year).filter(Boolean))].sort((a, b) => a! - b!) as number[];
  }, [pyqQuestions]);

  // Topic frequency data
  const topicFrequency = useMemo(() => {
    if (!pyqQuestions) return [];
    const counts: Record<string, number> = {};
    pyqQuestions.forEach(q => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    return Object.entries(counts)
      .map(([topic, count]) => ({
        topic,
        label: RBI_TOPIC_META[topic as RbiTopic]?.label || topic,
        icon: RBI_TOPIC_META[topic as RbiTopic]?.icon || '',
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [pyqQuestions]);

  // Year-wise topic breakdown
  const yearTopicGrid = useMemo(() => {
    if (!pyqQuestions || years.length === 0) return {};
    const grid: Record<string, Record<number, number>> = {};
    pyqQuestions.forEach(q => {
      if (!q.year) return;
      if (!grid[q.topic]) grid[q.topic] = {};
      grid[q.topic][q.year] = (grid[q.topic][q.year] || 0) + 1;
    });
    return grid;
  }, [pyqQuestions, years]);

  // Difficulty distribution per year
  const difficultyByYear = useMemo(() => {
    if (!pyqQuestions) return [];
    const map: Record<number, Record<string, number>> = {};
    pyqQuestions.forEach(q => {
      if (!q.year) return;
      if (!map[q.year]) map[q.year] = { easy: 0, medium: 0, hard: 0 };
      map[q.year][q.difficulty] = (map[q.year][q.difficulty] || 0) + 1;
    });
    return years.map(y => ({ year: y, ...map[y] }));
  }, [pyqQuestions, years]);

  // Subject-wise summary
  const subjectSummary = useMemo(() => {
    if (!pyqQuestions) return [];
    return RBI_SUBJECTS.map((sub, idx) => {
      const topics = RBI_SUBJECT_TOPICS[sub.key];
      const count = pyqQuestions.filter(q => (topics as readonly string[]).includes(q.topic)).length;
      return { ...sub, count, color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length] };
    }).filter(s => s.count > 0);
  }, [pyqQuestions]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading analysis...</div>;
  }

  const total = pyqQuestions?.length || 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/rbi/pyq')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to PYQ
          </button>
        </div>
        <Button variant="outline" onClick={() => navigate('/rbi/pyq/upload')} className="gap-2">
          <Upload className="h-4 w-4" /> Upload More
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">📊 RBI Grade B PYQ Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} questions across {years.length} years</p>
      </div>

      {total === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <p className="text-muted-foreground">No PYQ data yet. Upload question papers to see analysis.</p>
            <Button variant="outline" onClick={() => navigate('/rbi/pyq/upload')} className="gap-2">
              <Upload className="h-4 w-4" /> Upload First PDF
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Subject-wise pie chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Subject Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={subjectSummary} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ label, count }) => `${label} (${count})`}>
                      {subjectSummary.map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Difficulty by Year</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={difficultyByYear}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="easy" stackId="a" fill={DIFFICULTY_COLORS.easy} name="Easy" />
                    <Bar dataKey="medium" stackId="a" fill={DIFFICULTY_COLORS.medium} name="Medium" />
                    <Bar dataKey="hard" stackId="a" fill={DIFFICULTY_COLORS.hard} name="Hard" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Topic frequency bar chart */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Topic Frequency (Most Asked)</h3>
              <ResponsiveContainer width="100%" height={Math.max(300, topicFrequency.length * 28)}>
                <BarChart data={topicFrequency} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="label" type="category" width={160} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(210, 80%, 45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Year-wise topic grid */}
          {years.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Year-wise Topic Breakdown</h3>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topic</TableHead>
                        {years.map(y => <TableHead key={y} className="text-center w-16">{y}</TableHead>)}
                        <TableHead className="text-center w-16">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topicFrequency.map(tf => (
                        <TableRow key={tf.topic}>
                          <TableCell className="text-sm">
                            {tf.icon} {tf.label}
                          </TableCell>
                          {years.map(y => (
                            <TableCell key={y} className="text-center text-sm">
                              {yearTopicGrid[tf.topic]?.[y] || <span className="text-muted-foreground/30">—</span>}
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-semibold text-sm">{tf.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
