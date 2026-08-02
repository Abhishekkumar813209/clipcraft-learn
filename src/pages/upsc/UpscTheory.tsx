import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { getUpscSubject } from '@/lib/upscSubjects';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

interface TheoryRow {
  chapter_no: number;
  chapter_name: string;
  theory_md: string;
  question_count: number;
  generated_at: string;
}

export default function UpscTheory() {
  const nav = useNavigate();
  const { subject: slug, chapterNo } = useParams();
  const cfg = getUpscSubject(slug);
  const chapter = Number(chapterNo);

  const [row, setRow] = useState<TheoryRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('upsc_chapter_theory' as never)
      .select('chapter_no,chapter_name,theory_md,question_count,generated_at')
      .eq('subject', cfg.subject)
      .eq('chapter_no', chapter)
      .maybeSingle()
      .then(({ data }) => {
        setRow((data as unknown as TheoryRow) || null);
        setLoading(false);
      });
  }, [cfg.subject, chapter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 text-slate-900">
      <div className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button size="sm" variant="ghost" className="text-amber-700" onClick={() => nav(`/upsc/${cfg.slug}`)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">
              {row ? `Ch ${row.chapter_no} · ${row.chapter_name}` : `Chapter ${chapter}`}
            </div>
            <div className="text-[11px] text-slate-500 hidden sm:block">
              {cfg.label} · Hinglish theory {row ? `· ${row.question_count} questions se bani` : ''}
            </div>
          </div>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-500 text-white shrink-0"
            onClick={() => nav(`/upsc/${cfg.slug}/practice?chapter=${chapter}&order=serial`)}
          >
            <Sparkles className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Practice</span>
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" /> Theory load ho rahi hai…
          </div>
        )}
        {!loading && !row && (
          <p className="text-sm text-slate-600">
            Is chapter ki theory abhi generate nahi hui hai. Admin panel se generate karo.
          </p>
        )}
        {row && (
          <article className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h3:text-base prose-p:leading-relaxed prose-li:marker:text-amber-600 prose-table:text-sm prose-th:bg-amber-50 prose-strong:text-amber-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{row.theory_md}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
