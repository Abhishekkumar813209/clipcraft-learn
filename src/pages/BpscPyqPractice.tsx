import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BPSC_TOPIC_META, BPSC_ALL_TOPICS, type BpscTopic } from '@/types/bpsc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Filter } from 'lucide-react';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function BpscPyqPractice() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const topicFilter = searchParams.get('topic') || 'all';
  const yearFilter = searchParams.get('year') || 'all';
  const monthFilter = searchParams.get('month') || 'all';

  const setFilter = (key: string, v: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, v);
    setSearchParams(params, { replace: true });
  };

  // Fetch PYQ questions
  const { data: pyqQuestions, isLoading } = useQuery({
    queryKey: ['bpsc-pyq-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ssc_questions')
        .select('*')
        .eq('is_pyq', true)
        .eq('exam', 'BPSC' as any)
        .in('topic', [...BPSC_ALL_TOPICS] as any);
      if (error) throw error;
      return (data || []).map((q: any) => ({
        id: q.id,
        topic: q.topic as BpscTopic,
        question_text: q.question_text,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty: q.difficulty,
        year: q.year,
        month: q.month as number | null,
      }));
    },
  });

  const availableYears = useMemo(() => {
    if (!pyqQuestions) return [];
    return [...new Set(pyqQuestions.map(q => q.year).filter(Boolean))].sort((a, b) => b - a);
  }, [pyqQuestions]);

  const availableMonths = useMemo(() => {
    if (!pyqQuestions) return [];
    return [...new Set(pyqQuestions.map(q => q.month).filter((m): m is number => m != null))].sort((a, b) => a - b);
  }, [pyqQuestions]);

  const filteredByYearMonth = useMemo(() => {
    if (!pyqQuestions) return [];
    return pyqQuestions.filter(q => {
      if (yearFilter !== 'all' && q.year !== parseInt(yearFilter)) return false;
      if (monthFilter !== 'all' && q.month !== parseInt(monthFilter)) return false;
      return true;
    });
  }, [pyqQuestions, yearFilter, monthFilter]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredByYearMonth.forEach(q => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    return counts;
  }, [filteredByYearMonth]);

  const filtered = useMemo(() => {
    if (!pyqQuestions) return [];
    return pyqQuestions.filter(q => {
      if (topicFilter !== 'all' && q.topic !== topicFilter) return false;
      if (yearFilter !== 'all' && q.year !== parseInt(yearFilter)) return false;
      if (monthFilter !== 'all' && q.month !== parseInt(monthFilter)) return false;
      return true;
    });
  }, [pyqQuestions, topicFilter, yearFilter, monthFilter]);

  const startPractice = () => {
    if (filtered.length === 0) return;
    navigate(`/bpsc/pyq/practice?topic=${topicFilter}&year=${yearFilter}&month=${monthFilter}&q=0`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading PYQ questions...</div>;
  }

  const totalPyqs = pyqQuestions?.length || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">📋 BPSC PYQ Practice</h1>
          <p className="text-sm text-muted-foreground mt-1">{totalPyqs} previous year questions available</p>
        </div>
        <Button onClick={() => navigate('/bpsc/pyq/upload')} className="gap-2">
          <Upload className="h-4 w-4" /> Upload PYQ PDF
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={topicFilter} onValueChange={v => setFilter('topic', v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {BPSC_ALL_TOPICS.map(t => (
                  <SelectItem key={t} value={t}>
                    {BPSC_TOPIC_META[t]?.icon} {BPSC_TOPIC_META[t]?.label} ({topicCounts[t] || 0})
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

            {availableMonths.length > 0 && (
              <Select value={monthFilter} onValueChange={v => setFilter('month', v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {availableMonths.map(m => (
                    <SelectItem key={m} value={m.toString()}>{MONTH_NAMES[m - 1]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

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
          {BPSC_ALL_TOPICS.filter(t => topicCounts[t]).map(t => (
            <Card key={t} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter('topic', t)}>
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-2xl">{BPSC_TOPIC_META[t]?.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{BPSC_TOPIC_META[t]?.label}</p>
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
            <p className="text-muted-foreground">No PYQ questions yet. Upload a BPSC question paper PDF to get started.</p>
            <Button variant="outline" onClick={() => navigate('/bpsc/pyq/upload')} className="gap-2">
              <Upload className="h-4 w-4" /> Upload First PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}