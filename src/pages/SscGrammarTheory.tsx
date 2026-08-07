import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { fetchSscTheory } from '@/lib/sscChapters';
import { ArrowLeft, Loader2 } from 'lucide-react';

const SUBJECT = 'english_grammar';

export default function SscGrammarTheory() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const chapter = params.get('chapter') || '';
  const title = params.get('title') || chapter.replace(/_/g, ' ');

  const [row, setRow] = useState<{ theory_md: string; question_count: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSscTheory(SUBJECT, chapter, '').then((r) => {
      setRow(r);
      setLoading(false);
    });
  }, [chapter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900">
      <div className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-emerald-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button size="sm" variant="ghost" className="text-emerald-700" onClick={() => nav(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate capitalize">{title}</div>
            <div className="text-[11px] text-slate-500 hidden sm:block">
              English Grammar · Hinglish theory {row ? `· ${row.question_count} questions se bani` : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" /> Theory load ho rahi hai…
          </div>
        )}
        {!loading && !row && (
          <p className="text-sm text-slate-600">Is topic ki theory abhi generate nahi hui hai.</p>
        )}
        {row && (
          <>
            <p className="mb-4 text-[12px] text-slate-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              Har rule ke neeche <strong>Covers: Q…</strong> line hai — wo batati hai ye rule kaun se question numbers par lagta hai.
            </p>
            <article className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h3:text-base prose-p:leading-relaxed prose-li:marker:text-emerald-600 prose-table:text-sm prose-th:bg-emerald-50 prose-strong:text-emerald-900 prose-blockquote:border-emerald-400 prose-blockquote:bg-emerald-50/60 prose-blockquote:py-0.5 prose-blockquote:not-italic prose-blockquote:text-emerald-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{row.theory_md}</ReactMarkdown>
            </article>
          </>
        )}
      </div>
    </div>
  );
}
