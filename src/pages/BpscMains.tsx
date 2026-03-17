import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BPSC_MAINS_PAPERS, type BpscMainsPaper } from '@/types/bpsc';
import { useBpscMainsQuestions, useBpscMainsPaperCounts, useBpscMainsAnsweredIds } from '@/hooks/useBpscMains';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle2, FileText } from 'lucide-react';

export default function BpscMains() {
  const navigate = useNavigate();
  const { paper } = useParams<{ paper?: string }>();
  const selectedPaper = paper as BpscMainsPaper | undefined;
  const [yearFilter, setYearFilter] = useState<string>('all');

  const { data: counts } = useBpscMainsPaperCounts();
  const { data: questions, isLoading } = useBpscMainsQuestions(
    selectedPaper,
    yearFilter !== 'all' ? Number(yearFilter) : undefined
  );
  const { data: answeredIds } = useBpscMainsAnsweredIds();

  // Get unique years from questions for filter
  const years = [...new Set((questions || []).map(q => q.year).filter(Boolean) as number[])].sort((a, b) => b - a);

  if (!selectedPaper) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mains Preparation</h1>
          <p className="text-muted-foreground">Browse PYQs and practice descriptive answer writing with AI evaluation.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BPSC_MAINS_PAPERS.map((p) => (
            <Card
              key={p.key}
              className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-emerald-500/30"
              onClick={() => navigate(`/bpsc/mains/${p.key}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{p.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{p.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                    <p className="text-sm font-medium text-emerald-600 mt-3">
                      {counts?.[p.key] || 0} questions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const paperMeta = BPSC_MAINS_PAPERS.find(p => p.key === selectedPaper);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/bpsc/mains')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {paperMeta?.icon} {paperMeta?.label}
          </h1>
          <p className="text-muted-foreground text-sm">{paperMeta?.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(y => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {questions?.length || 0} questions
        </span>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading questions...</p>
      ) : !questions?.length ? (
        <p className="text-muted-foreground">No questions found for this paper.</p>
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const attempted = answeredIds?.has(q.id);
            return (
              <Card
                key={q.id}
                className="cursor-pointer hover:shadow-sm transition-shadow border-border hover:border-emerald-500/30"
                onClick={() => navigate(`/bpsc/mains/q/${q.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-sm font-semibold text-emerald-600">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2">{q.question_text}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{q.marks} marks</Badge>
                        {q.word_limit && <Badge variant="outline" className="text-xs">{q.word_limit} words</Badge>}
                        {q.year && <Badge variant="secondary" className="text-xs">{q.year}</Badge>}
                        <Badge variant="secondary" className="text-xs capitalize">{q.difficulty}</Badge>
                        {q.topic && <Badge variant="outline" className="text-xs">{q.topic}</Badge>}
                      </div>
                    </div>
                    {attempted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
