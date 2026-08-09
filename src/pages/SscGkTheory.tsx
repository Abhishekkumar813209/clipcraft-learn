import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { fetchSscTheory } from '@/lib/sscChapters';
import { gkSubject } from '@/lib/sscGkSubjects';
import { cleanTheoryMd } from '@/lib/cleanTheoryMd';
import { buildSerialIndex, compactSerials, parseTheorySections } from '@/lib/theoryLinks';
import { ArrowLeft, Sparkles, Loader2, Target, CornerDownLeft } from 'lucide-react';

export default function SscGkTheory() {
  const nav = useNavigate();
  const { subject: subjectParam } = useParams();
  const meta = gkSubject(subjectParam);
  const SUBJECT = meta.key;
  const base = `/ssc/gk/${SUBJECT}`;

  const [params] = useSearchParams();
  const chapter = params.get('chapter') || '';
  const subtopic = params.get('subtopic') || '';
  const focusQ = Number(params.get('q')) || 0;
  const ret = params.get('ret') || '';

  const [row, setRow] = useState<{ theory_md: string; question_count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>('');
  const scrolled = useRef(false);

  useEffect(() => {
    setLoading(true);
    scrolled.current = false;
    fetchSscTheory(SUBJECT, chapter, subtopic).then((r) => {
      setRow(r);
      setLoading(false);
    });
  }, [SUBJECT, chapter, subtopic]);

  const sections = useMemo(() => (row ? parseTheorySections(cleanTheoryMd(row.theory_md)) : []), [row]);
  const serialIndex = useMemo(() => buildSerialIndex(sections), [sections]);
  const mapped = serialIndex.size;

  useEffect(() => {
    if (!sections.length || scrolled.current) return;
    const id = focusQ ? serialIndex.get(focusQ) : '';
    if (!id) return;
    scrolled.current = true;
    setActive(id);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [sections, focusQ, serialIndex]);

  const practiceHref = (serial?: number) => {
    const p = new URLSearchParams();
    if (chapter) p.set('chapter', chapter);
    if (subtopic) p.set('subtopic', subtopic);
    if (serial) p.set('at', String(serial));
    return `${base}/practice?${p.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900">
      <div className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-emerald-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button size="sm" variant="ghost" className="text-emerald-700" onClick={() => nav(base)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">{subtopic || chapter}</div>
            <div className="text-[11px] text-slate-500 hidden sm:block">
              {meta.label} · Hinglish theory {row ? `· ${row.question_count} questions se bani` : ''}
              {mapped ? ` · ${mapped} questions mapped` : ''}
            </div>
          </div>
          {ret ? (
            <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 shrink-0" onClick={() => nav(ret)}>
              <CornerDownLeft className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Wapas Q{focusQ || ''}</span>
            </Button>
          ) : null}
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0" onClick={() => nav(practiceHref())}>
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
            Is {subtopic ? 'subtopic' : 'chapter'} ki theory abhi generate nahi hui hai. Admin panel se generate karo.
          </p>
        )}
        {row && (
          <>
            <p className="mb-4 text-[12px] text-slate-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {mapped
                ? 'Har part ke neeche question chips hain — chip dabao to seedhe wahi question practice me khul jayega.'
                : 'Is chapter me abhi question mapping nahi hui hai (Admin → Map questions → theory chalao). Practice button se poora chapter solve kar sakte ho.'}
            </p>

            <article className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h3:text-base prose-p:leading-relaxed prose-li:marker:text-emerald-600 prose-table:text-sm prose-th:bg-emerald-50 prose-strong:text-emerald-900 prose-blockquote:border-emerald-400 prose-blockquote:bg-emerald-50/60 prose-blockquote:py-0.5 prose-blockquote:not-italic prose-blockquote:text-emerald-800">
              {sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  className={`scroll-mt-24 rounded-lg transition ${active === s.id ? 'ring-2 ring-emerald-400 bg-emerald-50/60 px-3 py-1' : ''}`}
                >
                  {s.title && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{`${'#'.repeat(Math.max(1, s.level))} ${s.title}`}</ReactMarkdown>
                  )}
                  {s.serials.length > 0 && (
                    <div className="not-prose my-2 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <Target className="w-3.5 h-3.5" /> Covers {compactSerials(s.serials)}:
                      </span>
                      {s.serials.map((n) => (
                        <button
                          key={n}
                          onClick={() => nav(practiceHref(n))}
                          className="text-[11px] px-1.5 py-0.5 rounded border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                        >
                          Q{n}
                        </button>
                      ))}
                    </div>
                  )}
                  {s.body && <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.body}</ReactMarkdown>}
                </section>
              ))}
            </article>
          </>
        )}
      </div>
    </div>
  );
}
