import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SSC_SUBJECTS, SUBJECT_TOPICS, TOPIC_META, type SscSubject, type SscTopic } from '@/types/ssc';
import { useSscQuestionCount } from '@/hooks/useSscQuestions';
import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const BLACK_BOOK_TOPICS: SscTopic[] = ['idioms_phrases', 'one_word_substitution', 'synonyms_antonyms'];

const SLUG_TO_SUBJECT: Record<string, SscSubject> = {
  english: 'english',
  maths: 'quant',
  quant: 'quant',
  reasoning: 'reasoning',
  gk: 'gk',
};

export default function SscSubjectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).pop() ?? '';
  const subject: SscSubject = SLUG_TO_SUBJECT[slug] ?? 'english';
  const { data: counts } = useSscQuestionCount();

  const meta = SSC_SUBJECTS.find(s => s.key === subject)!;
  const topics = SUBJECT_TOPICS[subject];
  const { user } = useAuth();
  const [bbAttempted, setBbAttempted] = useState(0);
  const [bbCounts, setBbCounts] = useState<Record<string, number>>({});
  const bbTarget = 300;

  useEffect(() => {
    if (subject !== 'english') return;
    (async () => {
      const cats = ['idiom', 'ows', 'syn_ant'];
      const c: Record<string, number> = {};
      await Promise.all(cats.map(async (cat) => {
        const { count } = await supabase.from('ssc_black_book_items' as never)
          .select('id', { count: 'exact', head: true }).eq('category', cat);
        c[cat] = count || 0;
      }));
      const { count: synAntExt } = await supabase.from('ssc_syn_ant_items' as never)
        .select('id', { count: 'exact', head: true });
      c.syn_ant_ext = synAntExt || 0;
      setBbCounts(c);
    })();
  }, [subject]);

  useEffect(() => {
    if (!user || subject !== 'english') return;
    const today = new Date().toISOString().slice(0, 10);
    supabase.from('black_book_daily_progress' as never)
      .select('attempted').eq('user_id', user.id).eq('date', today)
      .then(({ data }) => {
        const sum = ((data as { attempted: number }[]) || []).reduce((s, p) => s + (p.attempted || 0), 0);
        setBbAttempted(sum);
      });
  }, [user, subject]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="text-3xl">{meta.icon}</span> {meta.label}
        </h1>
        <p className="text-muted-foreground">Pick a topic to start practicing.</p>
      </div>

      {subject === 'english' && (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs text-muted-foreground">Aaj ka Black Book target</div>
                <div className="text-lg font-semibold">{bbAttempted} / {bbTarget}</div>
              </div>
            </div>
            <div className="w-40 h-2.5 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${Math.min(100, (bbAttempted / bbTarget) * 100)}%` }} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subject === 'english' && (
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
            onClick={() => navigate('/ssc/english/parts-of-speech')}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🧩</span>
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded mb-1.5">New</span>
                  <h3 className="font-semibold text-foreground">Parts of Speech</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Verb · Basic (47) + more</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {topics.map((topic) => {
          const t = TOPIC_META[topic];
          let count = counts?.[topic] || 0;
          if (topic === 'idioms_phrases') count = bbCounts.idiom || 0;
          else if (topic === 'one_word_substitution') count = bbCounts.ows || 0;
          else if (topic === 'synonyms_antonyms') count = (bbCounts.syn_ant || 0) + (bbCounts.syn_ant_ext || 0);

          return (
            <Card
              key={topic}
              className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
              onClick={() => navigate(
                topic === 'idioms_phrases' ? '/ssc/english/idioms'
                : topic === 'one_word_substitution' ? '/ssc/english/ows'
                : topic === 'synonyms_antonyms' ? '/ssc/english/synant'
                : `/ssc/practice/${topic}`
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    {BLACK_BOOK_TOPICS.includes(topic) && (
                      <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded mb-1.5">
                        Black Book
                      </span>
                    )}
                    <h3 className="font-semibold text-foreground">{t.label}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{count} questions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
