import { useState } from 'react';
import { X, CheckCircle, Loader2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface QuizQuestion {
  id: number;
  question: string;
  type: 'mcq' | 'short';
  options?: string[];
  correctAnswer: string;
}

interface PdfQuizPanelProps {
  questions: QuizQuestion[];
  currentPage: number;
  pageRange?: { from: number; to: number };
  language: 'hindi' | 'english' | 'hinglish';
  pageText: string;
  onClose: () => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-chat`;

export function PdfQuizPanel({ questions, currentPage, pageRange, language, pageText, onClose }: PdfQuizPanelProps) {
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const setAnswer = (qId: number, value: string) => {
    setAnswers(prev => new Map(prev).set(qId, value));
  };

  const submitAnswers = async () => {
    if (answers.size < questions.length) {
      toast.error(language === 'hindi' ? 'सभी सवालों के जवाब दें' : 'Please answer all questions');
      return;
    }
    setIsChecking(true);
    try {
      const payload = questions.map(q => ({
        questionId: q.id,
        question: q.question,
        correctAnswer: q.correctAnswer,
        userAnswer: answers.get(q.id) || '',
      }));

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
      setFeedback(data.feedback);
    } catch {
      toast.error('Failed to check answers');
    }
    setIsChecking(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">
              {language === 'hindi' ? 'प्रश्नोत्तरी' : 'Quiz'}: {pageRange && pageRange.from !== pageRange.to ? `Pages ${pageRange.from}-${pageRange.to}` : `Page ${currentPage}`}
            </h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto p-4">
          {!feedback ? (
            <div className="space-y-5">
              {questions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <p className="font-medium text-sm">
                    {q.id}. {q.question}
                  </p>
                  {q.type === 'mcq' && q.options ? (
                    <div className="space-y-1.5 pl-4">
                      {q.options.map((opt, idx) => (
                        <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt}
                            checked={answers.get(q.id) === opt}
                            onChange={() => setAnswer(q.id, opt)}
                            className="accent-primary"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder={language === 'hindi' ? 'अपना उत्तर लिखें...' : 'Type your answer...'}
                      value={answers.get(q.id) || ''}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      className="w-full bg-muted rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-semibold">{language === 'hindi' ? 'परिणाम' : 'Results'}</span>
              </div>
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {!feedback ? (
            <Button className="w-full" onClick={submitAnswers} disabled={isChecking}>
              {isChecking ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {language === 'hindi' ? 'जाँच रहा है...' : 'Checking...'}</> :
                language === 'hindi' ? 'उत्तर जमा करें' : 'Submit Answers'}
            </Button>
          ) : (
            <Button className="w-full" variant="outline" onClick={onClose}>
              {language === 'hindi' ? 'बंद करें' : 'Close'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
