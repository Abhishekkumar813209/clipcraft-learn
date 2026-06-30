import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface Q {
  id: string;
  book_id: string;
  topic_id: string;
  subtopic_id: string | null;
  exam_tag: string;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation: string | null;
}

export default function AdminQuestions() {
  const { toast } = useToast();
  const [books, setBooks] = useState<{ id: string; name: string }[]>([]);
  const [topics, setTopics] = useState<{ id: string; book_id: string; name: string }[]>([]);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [bookId, setBookId] = useState('all');
  const [topicId, setTopicId] = useState('all');

  async function load() {
    let q = supabase.from('admin_questions' as never).select('*').order('created_at', { ascending: false }).limit(200);
    if (bookId !== 'all') q = q.eq('book_id', bookId);
    if (topicId !== 'all') q = q.eq('topic_id', topicId);
    const { data, error } = await q;
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setQuestions((data as Q[]) || []);
  }

  useEffect(() => {
    (async () => {
      const [b, t] = await Promise.all([
        supabase.from('admin_books' as never).select('id,name').order('name'),
        supabase.from('admin_topics' as never).select('id,book_id,name'),
      ]);
      setBooks((b.data as any) || []);
      setTopics((t.data as any) || []);
    })();
  }, []);

  useEffect(() => { load(); }, [bookId, topicId]);

  async function del(id: string) {
    if (!confirm('Delete this question?')) return;
    await supabase.from('admin_questions' as never).delete().eq('id', id);
    load();
  }

  const topicOptions = bookId === 'all' ? topics : topics.filter((t) => t.book_id === bookId);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Questions Bank</h1>

      <div className="flex gap-3 flex-wrap">
        <Select value={bookId} onValueChange={(v) => { setBookId(v); setTopicId('all'); }}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All books</SelectItem>
            {books.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={topicId} onValueChange={setTopicId}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All topics</SelectItem>
            {topicOptions.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground self-center">{questions.length} questions</span>
      </div>

      <div className="space-y-2">
        {questions.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between gap-2">
                <div className="text-sm font-medium flex-1">{q.question_text}</div>
                <Button variant="ghost" size="icon" onClick={() => del(q.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {q.options.map((o, i) => (
                  <div key={i} className={i === q.correct_option ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                    {String.fromCharCode(65 + i)}. {o}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 text-xs">
                <Badge variant="secondary">{q.exam_tag}</Badge>
                {q.explanation && <span className="text-muted-foreground italic line-clamp-1">{q.explanation}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
        {questions.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No questions yet.</CardContent></Card>
        )}
      </div>
    </div>
  );
}
