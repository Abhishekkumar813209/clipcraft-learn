import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, BookOpen, Brain, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Sentence { sentence: string; hindi: string; grammar: string; }
interface MCQ { question: string; options: string[]; answer: string; }
interface WordModule {
  word: string; meaning: string; synonyms: string[]; antonyms: string[];
  one_word_substitution: string; sentences: Sentence[]; mcqs: MCQ[];
}
interface Exercise {
  fill_blanks: { question: string; answer: string }[];
  translation: { hindi: string; english: string }[];
  error_correction: { sentence: string; corrected: string }[];
  one_word_substitution: { description: string; answer: string }[];
}

interface VocabWord { word: string; meaning: string | null; }

export default function SscVocabLearn() {
  const { root } = useParams<{ root: string }>();
  const navigate = useNavigate();
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

  const decodedRoot = root ? decodeURIComponent(root) : '';

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
    if (!root || !user) return;
    abortRef.current = false;

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
  }, [root, user, decodedRoot]);

  // Once wordList is set, load first word
  useEffect(() => {
    if (wordList.length === 0 || !user) return;

    const loadFirst = async () => {
      const first = wordList[0];
      await fetchWordModule(first, true);
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

  // Loading state for initial
  if (initialLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ssc/vocab')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
          <Brain className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Loading first word... This takes a few seconds.</span>
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || wordList.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ssc/vocab')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Learn Root</h1>
        </div>
        <Card>
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/ssc/vocab')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Badge className="font-mono text-lg px-3 py-1">{decodedRoot.toUpperCase()}</Badge>
            <span className="text-muted-foreground font-normal text-base">= {rootMeaning}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{wordList.length} words</p>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
        <Button variant="ghost" size="sm" onClick={goPrev} disabled={currentIdx === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
        <div className="flex items-center gap-2">
          {wordList.map((w, i) => {
            const loaded = !!wordModules[w.word];
            const isLoading = loadingWords.has(w.word);
            const isCurrent = i === currentIdx;
            return (
              <button
                key={w.word}
                onClick={() => setCurrentIdx(i)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  isCurrent ? 'bg-primary scale-125' :
                  loaded ? 'bg-primary/40' :
                  isLoading ? 'bg-yellow-400 animate-pulse' :
                  'bg-muted-foreground/20'
                }`}
                title={w.word}
              />
            );
          })}
        </div>
        <Button variant="ghost" size="sm" onClick={goNext} disabled={currentIdx >= wordList.length - 1}>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Word name indicator */}
      <div className="text-center">
        <span className="text-lg font-bold text-foreground">{currentWord?.word}</span>
        <span className="text-sm text-muted-foreground ml-2">({currentIdx + 1}/{wordList.length})</span>
        {isCurrentLoading && <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-primary" />}
      </div>

      {/* Current Word Content */}
      {!currentModule && isCurrentLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : !currentModule ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Loading this word...</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-4 space-y-4">
            {/* Meaning */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Meaning (Hinglish)</p>
              <p className="text-sm text-foreground">{currentModule.meaning}</p>
            </div>

            {/* Synonyms & Antonyms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Synonyms</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentModule.synonyms.map((s, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Antonyms</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentModule.antonyms.map((a, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">{a}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* One Word Substitution */}
            {currentModule.one_word_substitution && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">One Word Substitution</p>
                <p className="text-sm text-foreground italic">"{currentModule.one_word_substitution}"</p>
              </div>
            )}

            {/* Sentences */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Example Sentences</p>
              <div className="space-y-2">
                {currentModule.sentences.map((s, i) => (
                  <div key={i} className="bg-muted/40 rounded-lg p-3 text-sm space-y-1">
                    <p className="text-foreground">{s.sentence}</p>
                    <p className="text-muted-foreground text-xs">🇮🇳 {s.hindi}</p>
                    <p className="text-xs text-primary/70">📝 {s.grammar}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MCQs */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Practice MCQs</p>
              <div className="space-y-3">
                {currentModule.mcqs.map((mcq, mIdx) => {
                  const key = `${currentIdx}-${mIdx}`;
                  const selected = mcqAnswers[key];
                  const revealed = mcqRevealed.has(key);
                  return (
                    <div key={mIdx} className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm font-medium text-foreground mb-2">{mcq.question}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {mcq.options.map((opt, oIdx) => {
                          const isCorrect = opt === mcq.answer;
                          const isSelected = selected === opt;
                          let cls = "text-left text-xs px-3 py-2 rounded-md border transition-colors ";
                          if (revealed) {
                            if (isCorrect) cls += "bg-green-500/15 border-green-500/40 text-green-700 dark:text-green-400";
                            else if (isSelected && !isCorrect) cls += "bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-400";
                            else cls += "border-border text-muted-foreground";
                          } else {
                            cls += "border-border hover:bg-accent hover:text-accent-foreground cursor-pointer";
                          }
                          return (
                            <button key={oIdx} className={cls} onClick={() => selectMcqAnswer(key, opt)}>
                              {revealed && isCorrect && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                              {revealed && isSelected && !isCorrect && <XCircle className="inline h-3 w-3 mr-1" />}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Root-Level Exercises */}
      {exercises && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Root Exercises — {decodedRoot.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {exercises.fill_blanks?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Fill in the Blanks</p>
                <div className="space-y-2">
                  {exercises.fill_blanks.map((fb, i) => {
                    const key = `fb-${i}`;
                    return (
                      <div key={i} className="bg-muted/40 rounded-lg p-3">
                        <p className="text-sm text-foreground">{fb.question}</p>
                        <button onClick={() => toggleExercise(key)} className="text-xs text-primary mt-1 hover:underline">
                          {exerciseRevealed.has(key) ? 'Hide Answer' : 'Show Answer'}
                        </button>
                        {exerciseRevealed.has(key) && (
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">→ {fb.answer}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {exercises.translation?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Hindi → English Translation</p>
                <div className="space-y-2">
                  {exercises.translation.map((tr, i) => {
                    const key = `tr-${i}`;
                    return (
                      <div key={i} className="bg-muted/40 rounded-lg p-3">
                        <p className="text-sm text-foreground">🇮🇳 {tr.hindi}</p>
                        <button onClick={() => toggleExercise(key)} className="text-xs text-primary mt-1 hover:underline">
                          {exerciseRevealed.has(key) ? 'Hide Answer' : 'Show Answer'}
                        </button>
                        {exerciseRevealed.has(key) && (
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">→ {tr.english}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {exercises.error_correction?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Error Correction</p>
                <div className="space-y-2">
                  {exercises.error_correction.map((ec, i) => {
                    const key = `ec-${i}`;
                    return (
                      <div key={i} className="bg-muted/40 rounded-lg p-3">
                        <p className="text-sm text-foreground text-red-600 dark:text-red-400">❌ {ec.sentence}</p>
                        <button onClick={() => toggleExercise(key)} className="text-xs text-primary mt-1 hover:underline">
                          {exerciseRevealed.has(key) ? 'Hide Corrected' : 'Show Corrected'}
                        </button>
                        {exerciseRevealed.has(key) && (
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">✅ {ec.corrected}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {exercises.one_word_substitution?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">One Word Substitution</p>
                <div className="space-y-2">
                  {exercises.one_word_substitution.map((ows, i) => {
                    const key = `ows-${i}`;
                    return (
                      <div key={i} className="bg-muted/40 rounded-lg p-3">
                        <p className="text-sm text-foreground">{ows.description}</p>
                        <button onClick={() => toggleExercise(key)} className="text-xs text-primary mt-1 hover:underline">
                          {exerciseRevealed.has(key) ? 'Hide Answer' : 'Show Answer'}
                        </button>
                        {exerciseRevealed.has(key) && (
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">→ {ows.answer}</p>
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
    </div>
  );
}
