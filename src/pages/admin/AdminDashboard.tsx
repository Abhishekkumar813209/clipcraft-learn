import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, ListChecks, Layers, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ books: 0, topics: 0, subtopics: 0, questions: 0 });

  useEffect(() => {
    (async () => {
      const [b, t, s, q] = await Promise.all([
        supabase.from('admin_books' as never).select('*', { count: 'exact', head: true }),
        supabase.from('admin_topics' as never).select('*', { count: 'exact', head: true }),
        supabase.from('admin_subtopics' as never).select('*', { count: 'exact', head: true }),
        supabase.from('admin_questions' as never).select('*', { count: 'exact', head: true }),
      ]);
      setCounts({
        books: b.count || 0,
        topics: t.count || 0,
        subtopics: s.count || 0,
        questions: q.count || 0,
      });
    })();
  }, []);

  const stats = [
    { label: 'Books', value: counts.books, icon: BookOpen },
    { label: 'Topics', value: counts.topics, icon: Layers },
    { label: 'Subtopics', value: counts.subtopics, icon: Layers },
    { label: 'Questions', value: counts.questions, icon: ListChecks },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick start</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. Create a book under <strong>Books &amp; Topics</strong> and add its topics + subtopics.</p>
          <p>2. Go to <strong>Upload PDF</strong>, pick book → topic → subtopic, drop the PDF, review and save.</p>
          <p>3. Users can then take a <strong>Daily Quiz</strong> from subtopics they marked as studied.</p>
        </CardContent>
      </Card>
    </div>
  );
}
