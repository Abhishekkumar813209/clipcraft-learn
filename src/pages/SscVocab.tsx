import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import { Search, BookOpen, Star, Sparkles, Brain, Library } from 'lucide-react';
import {
  VOCABULARY, META, SECTION_TREE,
  filterWords, sortByFrequency, sortAlpha,
  type VocabularyWord,
} from '@/data/vocabulary';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PAGE_SIZE = 60;

export default function SscVocab() {
  const navigate = useNavigate();

  const [section, setSection] = useState<string | null>(null);
  const [subsection, setSubsection] = useState<string | null>(null);
  const [top500Only, setTop500Only] = useState(false);
  const [search, setSearch] = useState('');
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<'freq' | 'alpha'>('freq');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const base = filterWords({ section, subsection, top500Only, search, letter: letterFilter });
    return sortMode === 'freq' ? sortByFrequency(base) : sortAlpha(base);
  }, [section, subsection, top500Only, search, letterFilter, sortMode]);

  // Reset pagination when filters change
  useMemo(() => { setVisibleCount(PAGE_SIZE); }, [section, subsection, top500Only, search, letterFilter, sortMode]);

  const visible = filtered.slice(0, visibleCount);

  const selectSection = (sec: string | null, sub: string | null = null) => {
    setSection(sec);
    setSubsection(sub);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* ── Sidebar ── */}
          <aside className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">Vocabulary</h1>
              <p className="text-xs text-muted-foreground">
                Black Book · {META.total_words.toLocaleString()} words · static
              </p>
            </div>

            <Button
              className="w-full gap-2"
              onClick={() => navigate('/ssc/vocab/quiz')}
            >
              <Brain className="h-4 w-4" /> Start Quiz
            </Button>

            <Card>
              <CardContent className="p-2 space-y-0.5">
                <SidebarItem
                  active={section === null && !top500Only}
                  label="All Words"
                  count={META.total_words}
                  icon={<Library className="h-4 w-4" />}
                  onClick={() => { selectSection(null); setTop500Only(false); }}
                />
                <SidebarItem
                  active={top500Only}
                  label="Top 500 ⭐"
                  count={VOCABULARY.filter(w => w.is_top500).length}
                  icon={<Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                  onClick={() => { selectSection(null); setTop500Only(true); }}
                />
                <div className="h-px bg-border/60 my-1" />
                {SECTION_TREE.map(node => (
                  <div key={node.section}>
                    <SidebarItem
                      active={section === node.section && subsection === null && !top500Only}
                      label={node.section}
                      count={node.total}
                      icon={<BookOpen className="h-4 w-4" />}
                      onClick={() => { setTop500Only(false); selectSection(node.section, null); }}
                    />
                    {node.subsections.length > 1 && (section === node.section || subsection) && (
                      <div className="ml-6 mt-0.5 mb-1 space-y-0.5">
                        {node.subsections.map(sub => (
                          <SidebarItem
                            key={sub.name}
                            active={section === node.section && subsection === sub.name && !top500Only}
                            label={sub.name}
                            count={sub.count}
                            small
                            onClick={() => { setTop500Only(false); selectSection(node.section, sub.name); }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* ── Main ── */}
          <main className="space-y-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search word or meaning..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setSortMode('freq')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    sortMode === 'freq' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  SSC Freq
                </button>
                <button
                  onClick={() => setSortMode('alpha')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    sortMode === 'alpha' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  A–Z
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setLetterFilter(null)}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  !letterFilter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                All
              </button>
              {ALPHABET.map(letter => (
                <button
                  key={letter}
                  onClick={() => setLetterFilter(letter === letterFilter ? null : letter)}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                    letterFilter === letter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {filtered.length.toLocaleString()} words
                {section && <> · <Badge variant="outline" className="text-[10px]">{section}{subsection ? ` / ${subsection}` : ''}</Badge></>}
                {top500Only && <> · <span className="text-amber-600 dark:text-amber-400">Top 500 only</span></>}
              </span>
              {sortMode === 'freq' && <span>Sorted by SSC frequency (most asked first)</span>}
            </div>

            {filtered.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="font-semibold text-lg text-foreground mb-1">No matches</h3>
                  <p className="text-sm text-muted-foreground">Try a different search or filter.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {visible.map(w => (
                    <WordCard key={w.id} w={w} onOpen={() => navigate(`/ssc/vocab/word/${w.id}`)} />
                  ))}
                </div>
                {visibleCount < filtered.length && (
                  <div className="flex justify-center pt-2">
                    <Button variant="outline" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
                      Load more ({filtered.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

function SidebarItem({
  active, label, count, icon, onClick, small,
}: {
  active: boolean; label: string; count: number;
  icon?: React.ReactNode; onClick: () => void; small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 ${small ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-sm'} rounded-md transition-colors text-left ${
        active ? 'bg-primary/15 text-foreground font-medium' : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      <span className={`text-[10px] ${active ? 'text-foreground/70' : 'text-muted-foreground/70'}`}>
        {count.toLocaleString()}
      </span>
    </button>
  );
}

function WordCard({ w, onOpen }: { w: VocabularyWord; onOpen: () => void }) {
  return (
    <Card
      onClick={onOpen}
      className="cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start gap-2">
          <h3 className="font-semibold text-base text-foreground flex-1 leading-snug">{w.word}</h3>
          {w.is_top500 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0 mt-0.5" />
              </TooltipTrigger>
              <TooltipContent>Top 500 SSC word</TooltipContent>
            </Tooltip>
          )}
          {w.ssc_frequency != null && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono shrink-0">
                  #{w.ssc_frequency}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>SSC frequency rank — lower means asked more often</TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{w.meaning}</p>
        <div className="flex items-center gap-1.5 pt-1">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{w.section}</Badge>
          {w.subsection && w.subsection !== w.section && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">{w.subsection}</Badge>
          )}
          <Sparkles className="h-3 w-3 text-primary/60 ml-auto" />
        </div>
      </CardContent>
    </Card>
  );
}
