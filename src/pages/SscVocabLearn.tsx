import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, BookOpen, Brain, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface Sentence {
  sentence: string;
  hindi: string;
  grammar: string;
}

interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

interface WordModule {
  word: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  one_word_substitution: string;
  sentences: Sentence[];
  mcqs: MCQ[];
}

interface Exercise {
  fill_blanks: { question: string; answer: string }[];
  translation: { hindi: string; english: string }[];
  error_correction: { sentence: string; corrected: string }[];
  one_word_substitution: { description: string; answer: string }[];
}

interface LearningModule {
  root: string;
  root_meaning: string;
  words: WordModule[];
  exercises: Exercise;
}

export default function SscVocabLearn() {
  const { root } = useParams<{ root: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [module, setModule] = useState<LearningModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedWords, setExpandedWords] = useState<Set<number>>(new Set([0]));
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [mcqRevealed, setMcqRevealed] = useState<Set<string>>(new Set());
  const [exerciseRevealed, setExerciseRevealed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!root) return;
    const fetchAndGenerate = async () => {
      setLoading(true);
      setError(null);

      const decodedRoot = decodeURIComponent(root);

      // Fetch words for this root from DB
      const { data: words, error: dbError } = await supabase
        .from('ssc_vocabulary' as any)
        .select('word, meaning')
        .eq('root', decodedRoot)
        .order('word');

      if (dbError || !words || words.length === 0) {
        setError('No words found for this root.');
        setLoading(false);
        return;
      }

      // Get root_meaning from first word
      const { data: rootData } = await supabase
        .from('ssc_vocabulary' as any)
        .select('root_meaning')
        .eq('root', decodedRoot)
        .limit(1);

      const rootMeaning = (rootData as any)?.[0]?.root_meaning || '';

      try {
        const { data: fnData, error: fnError } = await supabase.functions.invoke('ssc-vocab-learn', {
          body: {
            root: decodedRoot,
            root_meaning: rootMeaning,
            words: (words as any[]).map(w => ({ word: w.word, meaning: w.meaning || '' })),
          },
        });

        if (fnError) throw new Error(fnError.message);
        if (fnData?.error) throw new Error(fnData.error);
        setModule(fnData as LearningModule);
      } catch (e: any) {
        console.error('Learn module error:', e);
        setError(e.message || 'Failed to generate learning module.');
        toast.error('Failed to generate learning module');
      } finally {
        setLoading(false);
      }
    };
    fetchAndGenerate();
  }, [root]);

  const toggleWord = (idx: number) => {
    setExpandedWords(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const selectMcqAnswer = (key: string, option: string) => {
    if (mcqRevealed.has(key)) return;
    setMcqAnswers(prev => ({ ...prev, [key]: option }));
    setMcqRevealed(prev => new Set(prev).add(key));
  };

  const toggleExercise = (key: string) => {
    setExerciseRevealed(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (loading) {
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
          <span className="text-sm text-muted-foreground">AI generating your complete learning module... This may take 15-30 seconds.</span>
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (error || !module) {
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
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Badge className="font-mono text-lg px-3 py-1">{module.root.toUpperCase()}</Badge>
            <span className="text-muted-foreground font-normal text-base">= {module.root_meaning}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{module.words.length} words • Complete learning module</p>
        </div>
      </div>

      {/* Word Cards */}
      <div className="space-y-4">
        {module.words.map((w, wIdx) => {
          const isExpanded = expandedWords.has(wIdx);
          return (
            <Card key={wIdx} className="overflow-hidden">
              <button
                onClick={() => toggleWord(wIdx)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm font-semibold">{w.word}</Badge>
                  <span className="text-sm text-muted-foreground">{w.meaning}</span>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {isExpanded && (
                <CardContent className="pt-0 pb-4 px-4 space-y-4 border-t">
                  {/* Synonyms & Antonyms */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Synonyms</p>
                      <div className="flex flex-wrap gap-1.5">
                        {w.synonyms.map((s, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Antonyms</p>
                      <div className="flex flex-wrap gap-1.5">
                        {w.antonyms.map((a, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* One Word Substitution */}
                  {w.one_word_substitution && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">One Word Substitution</p>
                      <p className="text-sm text-foreground italic">"{w.one_word_substitution}"</p>
                    </div>
                  )}

                  {/* Sentences */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Example Sentences</p>
                    <div className="space-y-2">
                      {w.sentences.map((s, i) => (
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
                      {w.mcqs.map((mcq, mIdx) => {
                        const key = `${wIdx}-${mIdx}`;
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
              )}
            </Card>
          );
        })}
      </div>

      {/* Root-Level Exercises */}
      {module.exercises && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Root Exercises — {module.root.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fill Blanks */}
            {module.exercises.fill_blanks?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Fill in the Blanks</p>
                <div className="space-y-2">
                  {module.exercises.fill_blanks.map((fb, i) => {
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

            {/* Translation */}
            {module.exercises.translation?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Hindi → English Translation</p>
                <div className="space-y-2">
                  {module.exercises.translation.map((tr, i) => {
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

            {/* Error Correction */}
            {module.exercises.error_correction?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Error Correction</p>
                <div className="space-y-2">
                  {module.exercises.error_correction.map((ec, i) => {
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

            {/* One Word Substitution */}
            {module.exercises.one_word_substitution?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">One Word Substitution</p>
                <div className="space-y-2">
                  {module.exercises.one_word_substitution.map((ows, i) => {
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
