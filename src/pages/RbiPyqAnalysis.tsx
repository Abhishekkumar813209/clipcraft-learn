import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RBI_TOPIC_META, RBI_ALL_TOPICS, RBI_PHASE1_TOPICS, RBI_PHASE2_TOPICS, type RbiTopic } from '@/types/rbi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Upload, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DIFFICULTY_COLORS = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' };
const TOPIC_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981', '#f43f5e'];

export default function RbiPyqAnalysis() {
  const navigate = useNavigate();
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

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

  const phaseTopics = useMemo(() => {
    if (phaseFilter === 'phase1') return RBI_PHASE1_TOPICS;
    if (phaseFilter === 'phase2') return RBI_PHASE2_TOPICS;
    return [...RBI_ALL_TOPICS];
  }, [phaseFilter]);

  const filteredQuestions = useMemo(() => {
    if (!pyqQuestions) return [];
    return pyqQuestions.filter(q => {
      if (!phaseTopics.includes(q.topic)) return false;
      if (subjectFilter !== 'all' && q.topic !== subjectFilter) return false;
      if (yearFilter !== 'all' && q.year !== parseInt(yearFilter)) return false;
      return true;
    });
  }, [pyqQuestions, phaseTopics, subjectFilter, yearFilter]);

  const years = useMemo(() => {
    if (!pyqQuestions) return [];
    return [...new Set(pyqQuestions.map(q => q.year).filter(Boolean))].sort((a, b) => a! - b!) as number[];
  }, [pyqQuestions]);

  const topicFrequency = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredQuestions.forEach(q => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    return phaseTopics
      .filter(t => counts[t])
      .map((topic, idx) => ({
        topic,
        label: RBI_TOPIC_META[topic]?.label || topic,
        icon: RBI_TOPIC_META[topic]?.icon || '',
        count: counts[topic] || 0,
        color: TOPIC_COLORS[idx % TOPIC_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredQuestions, phaseTopics]);

  const yearTopicGrid = useMemo(() => {
    const grid: Record<string, Record<number, number>> = {};
    filteredQuestions.forEach(q => {
      if (!q.year) return;
      if (!grid[q.topic]) grid[q.topic] = {};
      grid[q.topic][q.year] = (grid[q.topic][q.year] || 0) + 1;
    });
    return grid;
  }, [filteredQuestions]);

  const difficultyByYear = useMemo(() => {
    const map: Record<number, Record<string, number>> = {};
    filteredQuestions.forEach(q => {
      if (!q.year) return;
      if (!map[q.year]) map[q.year] = { easy: 0, medium: 0, hard: 0 };
      map[q.year][q.difficulty] = (map[q.year][q.difficulty] || 0) + 1;
    });
    return years.filter(y => map[y]).map(y => ({ year: y, ...map[y] }));
  }, [filteredQuestions, years]);

  const handlePhaseChange = (v: string) => {
    setPhaseFilter(v);
    setSubjectFilter('all');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading analysis...</div>;
  }

  const total = filteredQuestions.length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/rbi/pyq')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to PYQ
        </button>
        <Button variant="outline" onClick={() => navigate('/rbi/pyq/upload')} className="gap-2">
          <Upload className="h-4 w-4" /> Upload More
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">📊 RBI Grade B PYQ Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} questions {phaseFilter !== 'all' ? `(${phaseFilter === 'phase1' ? 'Phase 1' : 'Phase 2'})` : 'total'}</p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <Select value={phaseFilter} onValueChange={handlePhaseChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Phases" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                <SelectItem value="phase1">Phase 1</SelectItem>
                <SelectItem value="phase2">Phase 2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {phaseTopics.map(t => (
                  <SelectItem key={t} value={t}>
                    {RBI_TOPIC_META[t]?.icon} {RBI_TOPIC_META[t]?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-muted-foreground">
              {total} questions
            </div>
          </div>
        </CardContent>
      </Card>

      {total === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <p className="text-muted-foreground">No PYQ data matching filters. Upload question papers to see analysis.</p>
            <Button variant="outline" onClick={() => navigate('/rbi/pyq/upload')} className="gap-2">
              <Upload className="h-4 w-4" /> Upload First PDF
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Subject Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={topicFrequency} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ label, count }) => `${label} (${count})`}>
                      {topicFrequency.map((s, i) => (
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

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Subject Frequency (Most Asked)</h3>
              <ResponsiveContainer width="100%" height={Math.max(200, topicFrequency.length * 50)}>
                <BarChart data={topicFrequency} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="label" type="category" width={160} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(210, 80%, 45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {years.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Year-wise Subject Breakdown</h3>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
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
