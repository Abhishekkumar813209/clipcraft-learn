import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const EXAM_TAGS = ['SSC', 'NQT', 'BPSC', 'RBI', 'UPSC', 'Other'];

interface Book { id: string; name: string; exam_tag: string; description: string | null; }
interface Topic { id: string; book_id: string; name: string; }
interface Subtopic { id: string; topic_id: string; name: string; }

export default function AdminBooks() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [expandedTopic, setExpandedTopic] = useState<Set<string>>(new Set());

  const [newBook, setNewBook] = useState({ name: '', exam_tag: 'SSC', description: '' });
  const [open, setOpen] = useState(false);
  const [newTopic, setNewTopic] = useState<Record<string, string>>({});
  const [newSubtopic, setNewSubtopic] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const [b, t, s] = await Promise.all([
      supabase.from('admin_books' as never).select('*').order('created_at', { ascending: false }),
      supabase.from('admin_topics' as never).select('*').order('order_index'),
      supabase.from('admin_subtopics' as never).select('*').order('order_index'),
    ]);
    setBooks((b.data as Book[]) || []);
    setTopics((t.data as Topic[]) || []);
    setSubtopics((s.data as Subtopic[]) || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addBook() {
    if (!newBook.name.trim()) return;
    const { error } = await supabase.from('admin_books' as never).insert(newBook as never);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setNewBook({ name: '', exam_tag: 'SSC', description: '' });
    setOpen(false);
    load();
  }

  async function delBook(id: string) {
    if (!confirm('Delete this book and ALL its topics/subtopics/questions?')) return;
    const { error } = await supabase.from('admin_books' as never).delete().eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    load();
  }

  async function addTopic(bookId: string) {
    const name = (newTopic[bookId] || '').trim();
    if (!name) return;
    const { error } = await supabase.from('admin_topics' as never).insert({ book_id: bookId, name } as never);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setNewTopic((p) => ({ ...p, [bookId]: '' }));
    load();
  }

  async function delTopic(id: string) {
    if (!confirm('Delete topic?')) return;
    await supabase.from('admin_topics' as never).delete().eq('id', id);
    load();
  }

  async function addSubtopic(topicId: string) {
    const name = (newSubtopic[topicId] || '').trim();
    if (!name) return;
    const { error } = await supabase.from('admin_subtopics' as never).insert({ topic_id: topicId, name } as never);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setNewSubtopic((p) => ({ ...p, [topicId]: '' }));
    load();
  }

  async function delSubtopic(id: string) {
    if (!confirm('Delete subtopic?')) return;
    await supabase.from('admin_subtopics' as never).delete().eq('id', id);
    load();
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Books &amp; Topics</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-1" />Add Book</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Book</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Book name"
                value={newBook.name}
                onChange={(e) => setNewBook((p) => ({ ...p, name: e.target.value }))}
              />
              <Select value={newBook.exam_tag} onValueChange={(v) => setNewBook((p) => ({ ...p, exam_tag: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXAM_TAGS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                placeholder="Description (optional)"
                value={newBook.description}
                onChange={(e) => setNewBook((p) => ({ ...p, description: e.target.value }))}
              />
              <Button onClick={addBook} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {books.length === 0 && (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No books yet. Add your first book.</CardContent></Card>
      )}

      <div className="space-y-3">
        {books.map((book) => {
          const isOpen = expanded.has(book.id);
          const bookTopics = topics.filter((t) => t.book_id === book.id);
          return (
            <Card key={book.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    className="flex items-center gap-2 text-left"
                    onClick={() => {
                      setExpanded((p) => {
                        const n = new Set(p);
                        n.has(book.id) ? n.delete(book.id) : n.add(book.id);
                        return n;
                      });
                    }}
                  >
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="font-medium">{book.name}</span>
                    <Badge variant="secondary">{book.exam_tag}</Badge>
                    <span className="text-xs text-muted-foreground">{bookTopics.length} topics</span>
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => delBook(book.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                {isOpen && (
                  <div className="pl-6 space-y-3 border-l-2 border-primary/20">
                    <div className="flex gap-2">
                      <Input
                        placeholder="New topic name"
                        value={newTopic[book.id] || ''}
                        onChange={(e) => setNewTopic((p) => ({ ...p, [book.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && addTopic(book.id)}
                      />
                      <Button size="sm" onClick={() => addTopic(book.id)}>Add Topic</Button>
                    </div>
                    {bookTopics.map((topic) => {
                      const tOpen = expandedTopic.has(topic.id);
                      const topicSubs = subtopics.filter((s) => s.topic_id === topic.id);
                      return (
                        <div key={topic.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <button
                              className="flex items-center gap-2 text-sm"
                              onClick={() => {
                                setExpandedTopic((p) => {
                                  const n = new Set(p);
                                  n.has(topic.id) ? n.delete(topic.id) : n.add(topic.id);
                                  return n;
                                });
                              }}
                            >
                              {tOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              {topic.name}
                              <span className="text-xs text-muted-foreground">({topicSubs.length})</span>
                            </button>
                            <Button variant="ghost" size="icon" onClick={() => delTopic(topic.id)}>
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                          {tOpen && (
                            <div className="pl-5 space-y-2 border-l border-muted">
                              <div className="flex gap-2">
                                <Input
                                  className="h-8 text-xs"
                                  placeholder="New subtopic"
                                  value={newSubtopic[topic.id] || ''}
                                  onChange={(e) => setNewSubtopic((p) => ({ ...p, [topic.id]: e.target.value }))}
                                  onKeyDown={(e) => e.key === 'Enter' && addSubtopic(topic.id)}
                                />
                                <Button size="sm" variant="outline" onClick={() => addSubtopic(topic.id)}>Add</Button>
                              </div>
                              {topicSubs.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-muted/50">
                                  <span>{sub.name}</span>
                                  <button onClick={() => delSubtopic(sub.id)}>
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
