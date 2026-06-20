import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft, BookOpen, Brain, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, Loader2, Lightbulb, MessageSquare,
  PenLine, Sparkles, Target, BookText, AlertTriangle, Languages, Star
} from 'lucide-react';
import { toast } from 'sonner';
import { getWordById } from '@/data/vocabulary';

// Support both old (string[]) and new ({english,hindi}[]) MCQ option formats
type MCQOption = string | { english: string; hindi: string };
interface Sentence { sentence: string; hindi: string; grammar: string; }
interface MCQ { question: string; options: MCQOption[]; answer: string; }
interface WordModule {
  word: string; meaning: string; synonyms: string[]; antonyms: string[];
  one_word_substitution: string; sentences: Sentence[]; mcqs: MCQ[];
}
interface Exercise {
  fill_blanks: { question: string; answer: string; hindi?: string }[];
  translation: { hindi: string; english: string; explanation?: string; explanation_hindi?: string }[];
  error_correction: { sentence: string; corrected: string; explanation?: string; explanation_hindi?: string }[];
  one_word_substitution: { description: string; answer: string }[];
}

interface VocabWord { word: string; meaning: string | null; }

const getOptEnglish = (o: MCQOption) => typeof o === 'string' ? o : o.english;
const getOptHindi = (o: MCQOption) => typeof o === 'string' ? null : o.hindi;

export default function SscVocabLearn() {
  const { root, wordId } = useParams<{ root?: string; wordId?: string }>();
  const navigate = useNavigate();
  const staticWord = wordId ? getWordById(Number(wordId)) : null;
  const { user } = useAuth();

  const [wordList, setWordList] = useState<VocabWord[]>([]);
  const [rootMeaning, setRootMeaning] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wordModules, setWordModules] = useState<Record<string, WordModule>>({});
  const [exercises, setExercises] = useState<Exercise | null>(null);
  const [loadingWords, setLoadingWords] = useState<Set<string>>(new Set());
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [mcqRevealed, setMcqRevealed] = useState<Set<string>>(new Set());
  const [exerciseRevealed, setExerciseRevealed] = useState<Set<string>>(new Set());

  const bgFetchRef = useRef(false);
  const abortRef = useRef(false);

  const decodedRoot = staticWord
    ? (staticWord.section || 'vocab')
    : (root ? decodeURIComponent(root) : '');



  const fetchWordModule = useCallback(async (w: VocabWord, saveExercises: boolean) => {
    if (!user) return null;

    // Check cache first
    const { data: cached } = await supabase
      .from('ssc_vocab_learn_cache' as any)
      .select('module_data, exercises_data')
      .eq('user_id', user.id)
      .eq('word', w.word)
      .maybeSingle();

    if (cached) {
      const mod = (cached as any).module_data as WordModule;
      const ex = (cached as any).exercises_data as Exercise | null;
      setWordModules(prev => ({ ...prev, [w.word]: mod }));
      if (ex && !exercises) setExercises(ex);
      return mod;
    }

    // Call edge function for single word
    setLoadingWords(prev => new Set(prev).add(w.word));
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('ssc-vocab-learn', {
        body: { root: decodedRoot, root_meaning: rootMeaning, word: w.word, meaning: w.meaning || '' },
      });
      if (fnErr) throw new Error(fnErr.message);
      if (data?.error) throw new Error(data.error);

      const mod = data.word_module as WordModule;
      const ex = data.exercises as Exercise;

      setWordModules(prev => ({ ...prev, [w.word]: mod }));
      if (saveExercises && ex) setExercises(prev => prev || ex);

      // Save to cache
      await supabase.from('ssc_vocab_learn_cache' as any).insert({
        user_id: user.id,
        root: decodedRoot,
        word: w.word,
        module_data: mod,
        exercises_data: saveExercises ? ex : null,
      } as any);

      return mod;
    } catch (e: any) {
      console.error(`Failed to load ${w.word}:`, e);
      return null;
    } finally {
      setLoadingWords(prev => { const n = new Set(prev); n.delete(w.word); return n; });
    }
  }, [user, decodedRoot, rootMeaning, exercises]);

  // Initial load: fetch word list, then load first word, then background-fetch rest
  useEffect(() => {
    if (!user) return;
    abortRef.current = false;

    // ── Static single-word mode (Black Book) ──
    if (staticWord) {
      setWordList([{ word: staticWord.word, meaning: staticWord.meaning }]);
      setRootMeaning(staticWord.subsection || staticWord.section);
      setCurrentIdx(0);
      return () => { abortRef.current = true; };
    }

    if (!root) return;

    // ── Legacy root mode (Supabase) ──
    const init = async () => {
      setInitialLoading(true);
      setError(null);

      const { data: words, error: dbErr } = await supabase
        .from('ssc_vocabulary' as any)
        .select('word, meaning, root_meaning')
        .eq('root', decodedRoot)
        .order('word');

      if (dbErr || !words || words.length === 0) {
        setError('No words found for this root.');
        setInitialLoading(false);
        return;
      }

      const wList = (words as any[]).map(w => ({ word: w.word, meaning: w.meaning }));
      const rm = (words as any[])[0]?.root_meaning || '';
      setWordList(wList);
      setRootMeaning(rm);
      setCurrentIdx(0);
    };

    init();

    return () => { abortRef.current = true; };
  }, [root, wordId, user, decodedRoot, staticWord]);

  // Once wordList is set, load first word
  useEffect(() => {
    if (wordList.length === 0 || !user) return;

    const loadFirst = async () => {
      await fetchWordModule(wordList[0], true);
      setInitialLoading(false);
    };

    loadFirst();
  }, [wordList, user]);

  // Background-fetch remaining words after first is loaded
  useEffect(() => {
    if (initialLoading || wordList.length <= 1 || bgFetchRef.current) return;
    bgFetchRef.current = true;

    const bgFetch = async () => {
      for (let i = 1; i < wordList.length; i++) {
        if (abortRef.current) break;
        const w = wordList[i];
        if (wordModules[w.word]) continue;
        await fetchWordModule(w, i === 1 && !exercises);
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
      }
    };

    bgFetch();
  }, [initialLoading, wordList]);

  const currentWord = wordList[currentIdx];
  const currentModule = currentWord ? wordModules[currentWord.word] : null;
  const isCurrentLoading = currentWord ? loadingWords.has(currentWord.word) : false;

  const goNext = () => {
    if (currentIdx < wordList.length - 1) {
      setCurrentIdx(currentIdx + 1);
      // If not cached, trigger fetch
      const next = wordList[currentIdx + 1];
      if (next && !wordModules[next.word] && !loadingWords.has(next.word)) {
        fetchWordModule(next, false);
      }
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const selectMcqAnswer = (key: string, option: string) => {
    if (mcqRevealed.has(key)) return;
    setMcqAnswers(prev => ({ ...prev, [key]: option }));
    setMcqRevealed(prev => new Set(prev).add(key));
  };

  const toggleExercise = (key: string) => {
    setExerciseRevealed(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // ── Section Header Component ──
  const SectionHeader = ({ icon: Icon, title, color }: { icon: any; title: string; color: string }) => (
    <div className={`flex items-center gap-2.5 mb-3 pl-3 border-l-[3px] ${color}`}>
      <Icon className="h-4 w-4 opacity-80" />
      <span className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</span>
    </div>
  );

  // ── Loading State ──
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ssc/vocab')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex items-center gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <Brain className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Generating first word... takes a few seconds</span>
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (error || wordList.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ssc/vocab')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Learn Root</h1>
        </div>
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{error || 'Something went wrong.'}</p>
            <Button className="mt-4" onClick={() => navigate('/ssc/vocab')}>Back to Vocabulary</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Glassmorphism Header ── */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate('/ssc/vocab')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-primary tracking-wide">{decodedRoot.toUpperCase()}</span>
                <span className="text-muted-foreground text-sm hidden sm:inline">— {rootMeaning}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">{currentIdx + 1}/{wordList.length}</Badge>
          </div>

          {/* Navigation dots + arrows */}
          <div className="flex items-center justify-between mt-2">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={goPrev} disabled={currentIdx === 0}>
              <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
            </Button>
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60%] scrollbar-thin">
              {wordList.map((w, i) => {
                const loaded = !!wordModules[w.word];
                const isLoading = loadingWords.has(w.word);
                const isCurrent = i === currentIdx;
                return (
                  <button
                    key={w.word}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-2 rounded-full transition-all shrink-0 ${
                      isCurrent ? 'w-6 bg-primary' :
                      loaded ? 'w-2 bg-primary/30' :
                      isLoading ? 'w-2 bg-yellow-400 animate-pulse' :
                      'w-2 bg-muted-foreground/15'
                    }`}
                    title={w.word}
                  />
                );
              })}
            </div>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={goNext} disabled={currentIdx >= wordList.length - 1}>
              Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Word Title Card */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">{currentWord?.word}</h2>
          {isCurrentLoading && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...
            </div>
          )}
        </div>

        {/* Loading / Not loaded state */}
        {!currentModule && isCurrentLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : !currentModule ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Loading this word...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ── Meaning Card ── */}
            <Card className="overflow-hidden border-primary/10 shadow-sm">
              <CardContent className="p-5">
                <SectionHeader icon={Lightbulb} title="Meaning (Hinglish)" color="border-primary" />
                <p className="text-base text-foreground leading-relaxed pl-3">{currentModule.meaning}</p>
              </CardContent>
            </Card>

            {/* ── Synonyms & Antonyms ── */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-green-500/15 shadow-sm">
                <CardContent className="p-4">
                  <SectionHeader icon={Sparkles} title="Synonyms" color="border-green-500" />
                  <div className="flex flex-wrap gap-1.5 pl-3">
                    {currentModule.synonyms.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-500/15 shadow-sm">
                <CardContent className="p-4">
                  <SectionHeader icon={Target} title="Antonyms" color="border-red-500" />
                  <div className="flex flex-wrap gap-1.5 pl-3">
                    {currentModule.antonyms.map((a, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">{a}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── One Word Substitution ── */}
            {currentModule.one_word_substitution && (
              <Card className="border-purple-500/15 shadow-sm">
                <CardContent className="p-4">
                  <SectionHeader icon={BookText} title="One Word Substitution" color="border-purple-500" />
                  <p className="text-sm text-foreground italic pl-3">"{currentModule.one_word_substitution}"</p>
                </CardContent>
              </Card>
            )}

            {/* ── Sentences ── */}
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <SectionHeader icon={MessageSquare} title="Example Sentences" color="border-blue-500" />
                <div className="space-y-3 pl-3">
                  {currentModule.sentences.map((s, i) => {
                    const labels = ['Formal', 'Casual', 'Exam'];
                    return (
                      <div key={i} className="bg-muted/30 rounded-lg p-3.5 space-y-1.5 border border-border/40">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{labels[i] || `#${i+1}`}</Badge>
                        </div>
                        <p className="text-sm text-foreground">{s.sentence}</p>
                        <p className="text-xs text-muted-foreground">🇮🇳 {s.hindi}</p>
                        <p className="text-xs text-primary/70">📝 {s.grammar}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ── MCQs ── */}
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <SectionHeader icon={PenLine} title="Practice MCQs" color="border-amber-500" />
                <div className="space-y-4 pl-3">
                  {currentModule.mcqs.map((mcq, mIdx) => {
                    const key = `${currentIdx}-${mIdx}`;
                    const selected = mcqAnswers[key];
                    const revealed = mcqRevealed.has(key);
                    return (
                      <div key={mIdx} className="bg-muted/20 rounded-xl p-4 border border-border/30">
                        <p className="text-sm font-medium text-foreground mb-3">{mcq.question}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {mcq.options.map((opt, oIdx) => {
                            const eng = getOptEnglish(opt);
                            const hin = getOptHindi(opt);
                            const isCorrect = eng === mcq.answer;
                            const isSelected = selected === eng;
                            let cls = "text-left text-xs px-3 py-2.5 rounded-lg border-2 transition-all ";
                            if (revealed) {
                              if (isCorrect) cls += "bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-400";
                              else if (isSelected && !isCorrect) cls += "bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-400";
                              else cls += "border-border/30 text-muted-foreground opacity-60";
                            } else {
                              cls += "border-border/40 hover:border-primary/40 hover:bg-primary/5 cursor-pointer";
                            }
                            return (
                              <button key={oIdx} className={cls} onClick={() => selectMcqAnswer(key, eng)}>
                                <span className="flex items-start gap-1">
                                  {revealed && isCorrect && <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
                                  {revealed && isSelected && !isCorrect && <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
                                  <span>
                                    <span className="block">{eng}</span>
                                    {hin && <span className="block text-[10px] text-muted-foreground mt-0.5 font-normal">{hin}</span>}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* ── Root-Level Exercises ── */}
        {exercises && (
          <Card className="shadow-sm border-primary/10">
            <CardContent className="p-5 space-y-6">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-bold text-base text-foreground">Root Exercises — {decodedRoot.toUpperCase()}</span>
              </div>

              {/* Fill in the Blanks */}
              {exercises.fill_blanks?.length > 0 && (
                <div>
                  <SectionHeader icon={PenLine} title="Fill in the Blanks" color="border-blue-500" />
                  <div className="space-y-2 pl-3">
                    {exercises.fill_blanks.map((fb, i) => {
                      const key = `fb-${i}`;
                      return (
                        <div key={i} className="bg-muted/30 rounded-lg p-3.5 border border-border/30">
                          <p className="text-sm text-foreground">{fb.question}</p>
                          {fb.hindi && <p className="text-xs text-muted-foreground mt-1">🇮🇳 {fb.hindi}</p>}
                          <button onClick={() => toggleExercise(key)} className="text-xs text-primary mt-2 hover:underline font-medium">
                            {exerciseRevealed.has(key) ? '▼ Hide Answer' : '▶ Show Answer'}
                          </button>
                          {exerciseRevealed.has(key) && (
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1.5">→ {fb.answer}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Translation */}
              {exercises.translation?.length > 0 && (
                <div>
                  <SectionHeader icon={Languages} title="Hindi → English Translation" color="border-teal-500" />
                  <div className="space-y-2 pl-3">
                    {exercises.translation.map((tr, i) => {
                      const key = `tr-${i}`;
                      return (
                        <div key={i} className="bg-muted/30 rounded-lg p-3.5 border border-border/30">
                          <p className="text-sm text-foreground">🇮🇳 {tr.hindi}</p>
                          <button onClick={() => toggleExercise(key)} className="text-xs text-primary mt-2 hover:underline font-medium">
                            {exerciseRevealed.has(key) ? '▼ Hide Answer' : '▶ Show Answer'}
                          </button>
                          {exerciseRevealed.has(key) && (
                            <div className="mt-2 space-y-1.5">
                              <p className="text-sm font-semibold text-green-600 dark:text-green-400">→ {tr.english}</p>
                              {tr.explanation && (
                                <div className="bg-blue-500/5 rounded-md p-2.5 border border-blue-500/10 mt-2">
                                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">📖 Grammar Rule:</p>
                                  <p className="text-xs text-foreground">{tr.explanation}</p>
                                  {tr.explanation_hindi && (
                                    <p className="text-xs text-muted-foreground mt-1">🇮🇳 {tr.explanation_hindi}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Error Correction */}
              {exercises.error_correction?.length > 0 && (
                <div>
                  <SectionHeader icon={AlertTriangle} title="Error Correction" color="border-red-500" />
                  <div className="space-y-2 pl-3">
                    {exercises.error_correction.map((ec, i) => {
                      const key = `ec-${i}`;
                      return (
                        <div key={i} className="bg-muted/30 rounded-lg p-3.5 border border-border/30">
                          <p className="text-sm text-red-600 dark:text-red-400">❌ {ec.sentence}</p>
                          <button onClick={() => toggleExercise(key)} className="text-xs text-primary mt-2 hover:underline font-medium">
                            {exerciseRevealed.has(key) ? '▼ Hide Corrected' : '▶ Show Corrected'}
                          </button>
                          {exerciseRevealed.has(key) && (
                            <div className="mt-2 space-y-1.5">
                              <p className="text-sm font-semibold text-green-600 dark:text-green-400">✅ {ec.corrected}</p>
                              {ec.explanation && (
                                <div className="bg-amber-500/5 rounded-md p-2.5 border border-amber-500/10 mt-2">
                                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">⚠️ Why this error?</p>
                                  <p className="text-xs text-foreground">{ec.explanation}</p>
                                  {ec.explanation_hindi && (
                                    <p className="text-xs text-muted-foreground mt-1">🇮🇳 {ec.explanation_hindi}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* One Word Substitution */}
              {exercises.one_word_substitution?.length > 0 && (
                <div>
                  <SectionHeader icon={BookText} title="One Word Substitution" color="border-purple-500" />
                  <div className="space-y-2 pl-3">
                    {exercises.one_word_substitution.map((ows, i) => {
                      const key = `ows-${i}`;
                      return (
                        <div key={i} className="bg-muted/30 rounded-lg p-3.5 border border-border/30">
                          <p className="text-sm text-foreground">{ows.description}</p>
                          <button onClick={() => toggleExercise(key)} className="text-xs text-primary mt-2 hover:underline font-medium">
                            {exerciseRevealed.has(key) ? '▼ Hide Answer' : '▶ Show Answer'}
                          </button>
                          {exerciseRevealed.has(key) && (
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1.5">→ {ows.answer}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
