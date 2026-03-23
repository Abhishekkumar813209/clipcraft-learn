import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RBI_TOPIC_META, RBI_ALL_TOPICS, type RbiTopic } from '@/types/rbi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Filter, BarChart3 } from 'lucide-react';

export default function RbiPyqPractice() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const topicFilter = searchParams.get('topic') || 'all';
  const yearFilter = searchParams.get('year') || 'all';

  const setFilter = (key: string, v: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, v);
    setSearchParams(params, { replace: true });
  };

  const { data: pyqQuestions, isLoading } = useQuery({
    queryKey: ['rbi-pyq-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ssc_questions')
        .select('*')
        .eq('is_pyq', true)
        .eq('exam', 'RBI' as any)
        .in('topic', [...RBI_ALL_TOPICS] as any);
      if (error) throw error;
      return (data || []).map((q: any) => ({
        id: q.id,
        topic: q.topic as RbiTopic,
        question_text: q.question_text,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty: q.difficulty,
        year: q.year,
      }));
    },
  });

  const availableYears = useMemo(() => {
    if (!pyqQuestions) return [];
    return [...new Set(pyqQuestions.map(q => q.year).filter(Boolean))].sort((a, b) => b - a);
  }, [pyqQuestions]);

  const filteredByYear = useMemo(() => {
    if (!pyqQuestions) return [];
    return pyqQuestions.filter(q => {
      if (yearFilter !== 'all' && q.year !== parseInt(yearFilter)) return false;
      return true;
    });
  }, [pyqQuestions, yearFilter]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredByYear.forEach(q => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    return counts;
  }, [filteredByYear]);

  const filtered = useMemo(() => {
    if (!pyqQuestions) return [];
    return pyqQuestions.filter(q => {
      if (topicFilter !== 'all' && q.topic !== topicFilter) return false;
      if (yearFilter !== 'all' && q.year !== parseInt(yearFilter)) return false;
      return true;
    });
  }, [pyqQuestions, topicFilter, yearFilter]);

  const startPractice = () => {
    if (filtered.length === 0) return;
    navigate(`/rbi/pyq/practice?topic=${topicFilter}&year=${yearFilter}&q=0`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading PYQ questions...</div>;
  }

  const totalPyqs = pyqQuestions?.length || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">🏛️ RBI Grade B PYQ Bank</h1>
          <p className="text-sm text-muted-foreground mt-1">{totalPyqs} previous year questions available</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/rbi/pyq/analysis')} className="gap-2">
            <BarChart3 className="h-4 w-4" /> Analysis
          </Button>
          <Button onClick={() => navigate('/rbi/pyq/upload')} className="gap-2">
            <Upload className="h-4 w-4" /> Upload PYQ PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={topicFilter} onValueChange={v => setFilter('topic', v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {RBI_ALL_TOPICS.map(t => (
                  <SelectItem key={t} value={t}>
                    {RBI_TOPIC_META[t]?.icon} {RBI_TOPIC_META[t]?.label} ({topicCounts[t] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={v => setFilter('year', v)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map(y => (
                  <SelectItem key={y} value={y!.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-muted-foreground">
              {filtered.length} questions match
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={startPractice} disabled={filtered.length === 0} size="lg" className="w-full gap-2 text-base">
        Start PYQ Practice ({filtered.length} questions)
      </Button>

      {totalPyqs > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RBI_ALL_TOPICS.filter(t => topicCounts[t]).map(t => (
            <Card key={t} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter('topic', t)}>
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-2xl">{RBI_TOPIC_META[t]?.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{RBI_TOPIC_META[t]?.label}</p>
                  <p className="text-xs text-muted-foreground">{topicCounts[t]} questions</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPyqs === 0 && (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <p className="text-muted-foreground">No PYQ questions yet. Upload an RBI Grade B question paper PDF to get started.</p>
            <Button variant="outline" onClick={() => navigate('/rbi/pyq/upload')} className="gap-2">
              <Upload className="h-4 w-4" /> Upload First PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
