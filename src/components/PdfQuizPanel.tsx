import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, Brain, Save, FolderPlus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type QuizType = 'mcq' | 'true_false' | 'fill_blank' | 'multiple_correct' | 'short';

const QUIZ_TYPE_LABELS: Record<QuizType, string> = {
  mcq: 'MCQ',
  true_false: 'True / False',
  fill_blank: 'Fill in the Blanks',
  multiple_correct: 'Multiple Correct',
  short: 'Short Answer',
};

interface QuizQuestion {
  id: number;
  question: string;
  type: 'mcq' | 'short' | 'true_false' | 'fill_blank' | 'multiple_correct';
  options?: string[];
  correctAnswer: string;
}

interface PdfQuizPanelProps {
  questions: QuizQuestion[];
  currentPage: number;
  pageRange?: { from: number; to: number };
  language: 'hindi' | 'english' | 'hinglish';
  pageText: string;
  fileName?: string;
  onClose: () => void;
  onGenerateQuiz?: (opts: { numQuestions: number; questionTypes: QuizType[]; focusTopics: string[] }) => void;
}

interface QuizFolder {
  id: string;
  name: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-chat`;
const QUIZ_STATE_KEY = 'pdf-quiz-state';

function serializeMultiAnswers(m: Map<number, Set<string>>): Record<number, string[]> {
  const obj: Record<number, string[]> = {};
  m.forEach((set, key) => { obj[key] = Array.from(set); });
  return obj;
}

function deserializeMultiAnswers(obj: Record<number, string[]>): Map<number, Set<string>> {
  const m = new Map<number, Set<string>>();
  for (const [k, v] of Object.entries(obj)) {
    m.set(Number(k), new Set(v));
  }
  return m;
}

function serializeAnswers(m: Map<number, string>): Record<number, string> {
  const obj: Record<number, string> = {};
  m.forEach((v, k) => { obj[k] = v; });
  return obj;
}

function deserializeAnswers(obj: Record<number, string>): Map<number, string> {
  const m = new Map<number, string>();
  for (const [k, v] of Object.entries(obj)) {
    m.set(Number(k), v);
  }
  return m;
}

export function PdfQuizPanel({ questions, currentPage, pageRange, language, pageText, fileName, onClose, onGenerateQuiz }: PdfQuizPanelProps) {
  const { user } = useAuth();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('none');
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState<QuizFolder[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showWeakAreaDialog, setShowWeakAreaDialog] = useState(false);
  const [weakQuizCount, setWeakQuizCount] = useState(5);
  const [customWeakCount, setCustomWeakCount] = useState('');
  const [weakQuizTypes, setWeakQuizTypes] = useState<Set<QuizType>>(new Set(['mcq', 'true_false', 'fill_blank', 'multiple_correct', 'short']));

  const [answers, setAnswers] = useState<Map<number, string>>(() => {
    try {
      const saved = sessionStorage.getItem(QUIZ_STATE_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        if (s.answers) return deserializeAnswers(s.answers);
      }
    } catch {}
    return new Map();
  });

  const [multiAnswers, setMultiAnswers] = useState<Map<number, Set<string>>>(() => {
    try {
      const saved = sessionStorage.getItem(QUIZ_STATE_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        if (s.multiAnswers) return deserializeMultiAnswers(s.multiAnswers);
      }
    } catch {}
    return new Map();
  });

  const [feedback, setFeedback] = useState<string | null>(() => {
    try {
      const saved = sessionStorage.getItem(QUIZ_STATE_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        return s.feedback || null;
      }
    } catch {}
    return null;
  });

  const [isChecking, setIsChecking] = useState(false);

  // Persist state to sessionStorage on changes
  const persistState = useCallback(() => {
    try {
      sessionStorage.setItem(QUIZ_STATE_KEY, JSON.stringify({
        answers: serializeAnswers(answers),
        multiAnswers: serializeMultiAnswers(multiAnswers),
        feedback,
      }));
    } catch {}
  }, [answers, multiAnswers, feedback]);

  useEffect(() => {
    persistState();
  }, [persistState]);

  const setAnswer = (qId: number, value: string) => {
    setAnswers(prev => new Map(prev).set(qId, value));
  };

  const toggleMultiAnswer = (qId: number, value: string) => {
    setMultiAnswers(prev => {
      const next = new Map(prev);
      const current = new Set(next.get(qId) || []);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      next.set(qId, current);
      return next;
    });
  };

  const getAnswerForQuestion = (q: QuizQuestion): string => {
    if (q.type === 'multiple_correct') {
      return Array.from(multiAnswers.get(q.id) || []).join(', ');
    }
    return answers.get(q.id) || '';
  };

  const answeredCount = questions.filter(q => {
    if (q.type === 'multiple_correct') return (multiAnswers.get(q.id)?.size || 0) > 0;
    return !!answers.get(q.id);
  }).length;

  const getWeakQuestions = (): QuizQuestion[] => {
    return questions.filter(q => {
      const ans = getAnswerForQuestion(q);
      return !ans || ans === '(skipped)';
    });
  };

  const toggleWeakQuizType = (type: QuizType) => {
    setWeakQuizTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) { if (next.size > 1) next.delete(type); }
      else next.add(type);
      return next;
    });
  };

  const handlePracticeWeakAreas = () => {
    if (!onGenerateQuiz) return;
    const weakQs = getWeakQuestions();
    const focusTopics = weakQs.map(q => q.question);
    const finalCount = customWeakCount ? Math.min(Math.max(Number(customWeakCount), 1), 20) : weakQuizCount;
    setShowWeakAreaDialog(false);
    onGenerateQuiz({ numQuestions: finalCount, questionTypes: Array.from(weakQuizTypes), focusTopics });
  };

  const navigate = useNavigate();

  const submitAnswers = async () => {
    if (answeredCount === 0) {
      toast.error(language === 'hindi' ? 'कम से कम एक सवाल का जवाब दें' : 'Please answer at least one question');
      return;
    }
    if (!user) {
      toast.error('Please sign in to submit quizzes');
      return;
    }
    setIsChecking(true);
    try {
      const payload = questions.map(q => {
        const ans = getAnswerForQuestion(q);
        return {
          questionId: q.id,
          question: q.question,
          correctAnswer: q.correctAnswer,
          userAnswer: ans || '(skipped)',
        };
      });

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: 'check-answers', pageText, language, answers: payload }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Failed' }));
        toast.error(err.error || 'Failed to check answers');
        setIsChecking(false);
        return;
      }

      const data = await resp.json();
      const aiFeedback = data.feedback;

      // Build user_answers array
      const userAnswersData = questions.map(q => ({
        questionId: q.id,
        answer: getAnswerForQuestion(q) || '(skipped)',
      }));

      // Auto-save to DB
      const range = pageRange && pageRange.from !== pageRange.to ? `${pageRange.from}-${pageRange.to}` : `${currentPage}`;
      const autoName = `${fileName || 'PDF'} - Page ${range}`;
      const { data: savedQuiz, error: saveErr } = await supabase.from('pdf_saved_quizzes').insert({
        user_id: user.id,
        name: autoName,
        pdf_name: fileName || null,
        page_range: range,
        questions: questions as any,
        language,
        user_answers: userAnswersData as any,
        ai_feedback: aiFeedback,
      }).select('id').single();

      if (saveErr) throw saveErr;

      // Clear session state
      sessionStorage.removeItem(QUIZ_STATE_KEY);

      // Navigate to analysis page
      onClose();
      navigate(`/quizzes/${savedQuiz.id}/analysis`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit answers');
    }
    setIsChecking(false);
  };

  const loadFolders = async () => {
    if (!user) return;
    const { data } = await supabase.from('pdf_quiz_folders').select('id, name').eq('user_id', user.id).order('name');
    if (data) setFolders(data);
  };

  const openSaveDialog = () => {
    const range = pageRange && pageRange.from !== pageRange.to ? `${pageRange.from}-${pageRange.to}` : `${currentPage}`;
    setSaveName(`${fileName || 'PDF'} - Page ${range}`);
    setSelectedFolderId('none');
    setNewFolderName('');
    loadFolders();
    setShowSaveDialog(true);
  };

  const handleSaveQuiz = async () => {
    if (!user) { toast.error('Please sign in to save quizzes'); return; }
    if (!saveName.trim()) { toast.error('Please enter a quiz name'); return; }
    setIsSaving(true);
    try {
      let folderId: string | null = null;
      if (selectedFolderId === 'new' && newFolderName.trim()) {
        const { data: newFolder, error: folderErr } = await supabase.from('pdf_quiz_folders').insert({ user_id: user.id, name: newFolderName.trim() }).select('id').single();
        if (folderErr) throw folderErr;
        folderId = newFolder.id;
      } else if (selectedFolderId !== 'none') {
        folderId = selectedFolderId;
      }

      const range = pageRange && pageRange.from !== pageRange.to ? `${pageRange.from}-${pageRange.to}` : `${currentPage}`;
      const { error } = await supabase.from('pdf_saved_quizzes').insert({
        user_id: user.id,
        folder_id: folderId,
        name: saveName.trim(),
        pdf_name: fileName || null,
        page_range: range,
        questions: questions as any,
        language,
      });
      if (error) throw error;
      toast.success(language === 'hindi' ? 'क्विज़ सेव हो गया!' : 'Quiz saved!');
      setShowSaveDialog(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save quiz');
    }
    setIsSaving(false);
  };

  const renderQuestion = (q: QuizQuestion) => {
    switch (q.type) {
      case 'true_false':
        return (
          <div className="space-y-1.5 pl-4">
            {['True', 'False'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                <input type="radio" name={`q-${q.id}`} value={opt} checked={answers.get(q.id) === opt} onChange={() => setAnswer(q.id, opt)} className="accent-primary" />
                {opt}
              </label>
            ))}
          </div>
        );

      case 'fill_blank':
        return (
          <div className="pl-4 space-y-1.5">
            <p className="text-xs text-muted-foreground italic">Fill in the blank(s)</p>
            <input type="text" placeholder={language === 'hindi' ? 'रिक्त स्थान भरें...' : 'Fill in the blank...'} value={answers.get(q.id) || ''} onChange={(e) => setAnswer(q.id, e.target.value)} className="w-full bg-muted rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
        );

      case 'multiple_correct':
        return (
          <div className="space-y-1.5 pl-4">
            <p className="text-xs text-muted-foreground italic">Select all that apply</p>
            {q.options?.map((opt, idx) => {
              const selected = multiAnswers.get(q.id)?.has(opt) || false;
              return (
                <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" checked={selected} onChange={() => toggleMultiAnswer(q.id, opt)} className="accent-primary" />
                  {opt}
                </label>
              );
            })}
          </div>
        );

      case 'mcq':
        return (
          <div className="space-y-1.5 pl-4">
            {q.options?.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                <input type="radio" name={`q-${q.id}`} value={opt} checked={answers.get(q.id) === opt} onChange={() => setAnswer(q.id, opt)} className="accent-primary" />
                {opt}
              </label>
            ))}
          </div>
        );

      case 'short':
      default:
        return (
          <input type="text" placeholder={language === 'hindi' ? 'अपना उत्तर लिखें...' : 'Type your answer...'} value={answers.get(q.id) || ''} onChange={(e) => setAnswer(q.id, e.target.value)} className="w-full bg-muted rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">
              {language === 'hindi' ? 'प्रश्नोत्तरी' : 'Quiz'}: {pageRange && pageRange.from !== pageRange.to ? `Pages ${pageRange.from}-${pageRange.to}` : `Page ${currentPage}`}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={openSaveDialog} title="Save Quiz">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto p-4">
          <div className="space-y-5">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="font-medium text-sm">
                  {q.id}. {q.question}
                  {q.type !== 'mcq' && q.type !== 'short' && (
                    <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {q.type === 'true_false' ? 'T/F' : q.type === 'fill_blank' ? 'Fill' : 'Multi'}
                    </span>
                  )}
                </p>
                {renderQuestion(q)}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border space-y-2">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              {language === 'hindi' ? `${answeredCount}/${questions.length} उत्तर दिए` : `${answeredCount}/${questions.length} answered`}
            </p>
            <Button className="w-full" onClick={submitAnswers} disabled={isChecking}>
              {isChecking ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {language === 'hindi' ? 'जाँच रहा है...' : 'Submitting...'}</> :
                language === 'hindi' ? 'उत्तर जमा करें' : 'Submit Answers'}
            </Button>
          </div>
        </div>
      </div>

      {/* Save Quiz Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'hindi' ? 'क्विज़ सेव करें' : 'Save Quiz'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-name">{language === 'hindi' ? 'क्विज़ का नाम' : 'Quiz Name'}</Label>
              <Input id="quiz-name" value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="e.g. Polity Chapter 3 Quiz" />
            </div>
            <div className="space-y-2">
              <Label>{language === 'hindi' ? 'फ़ोल्डर' : 'Folder'}</Label>
              <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{language === 'hindi' ? 'कोई फ़ोल्डर नहीं' : 'No Folder'}</SelectItem>
                  {folders.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                  <SelectItem value="new">
                    <span className="flex items-center gap-1"><FolderPlus className="h-3 w-3" /> {language === 'hindi' ? 'नया फ़ोल्डर' : 'New Folder'}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {selectedFolderId === 'new' && (
                <Input placeholder={language === 'hindi' ? 'फ़ोल्डर का नाम' : 'Folder name'} value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} className="mt-2" />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveQuiz} disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Weak Area Practice Dialog */}
      <Dialog open={showWeakAreaDialog} onOpenChange={setShowWeakAreaDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {language === 'hindi' ? 'कमज़ोर क्षेत्र अभ्यास' : 'Practice Weak Areas'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'hindi' ? 'प्रश्नों की संख्या' : 'Number of Questions'}</Label>
              <div className="flex gap-2 flex-wrap">
                {[3, 5, 10].map(n => (
                  <Button key={n} size="sm" variant={weakQuizCount === n && !customWeakCount ? 'default' : 'outline'} onClick={() => { setWeakQuizCount(n); setCustomWeakCount(''); }}>
                    {n}
                  </Button>
                ))}
                <Input type="number" placeholder="Custom" value={customWeakCount} onChange={e => setCustomWeakCount(e.target.value)} className="w-20 h-8 text-sm" min={1} max={20} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === 'hindi' ? 'प्रश्न प्रकार' : 'Question Types'}</Label>
              <div className="space-y-2">
                {(Object.entries(QUIZ_TYPE_LABELS) as [QuizType, string][]).map(([type, label]) => (
                  <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={weakQuizTypes.has(type)} onCheckedChange={() => toggleWeakQuizType(type)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWeakAreaDialog(false)}>Cancel</Button>
            <Button onClick={handlePracticeWeakAreas}>
              <Brain className="h-4 w-4 mr-2" /> {language === 'hindi' ? 'क्विज़ बनाएँ' : 'Generate Quiz'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
