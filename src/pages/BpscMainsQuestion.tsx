import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBpscMainsQuestions, useBpscMainsUserAnswers, useSubmitMainsAnswer } from '@/hooks/useBpscMains';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Loader2, BookOpen, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BpscMainsQuestion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [answer, setAnswer] = useState('');
  const [showModel, setShowModel] = useState(false);

  const { data: allQuestions } = useBpscMainsQuestions();
  const question = allQuestions?.find(q => q.id === id);
  const { data: userAnswers, isLoading: loadingAnswers } = useBpscMainsUserAnswers(id);
  const submitMutation = useSubmitMainsAnswer();

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const latestAnswer = userAnswers?.[0];

  const handleSubmit = async () => {
    if (!question || !answer.trim()) return;
    try {
      await submitMutation.mutateAsync({
        questionId: question.id,
        answerText: answer.trim(),
        questionText: question.question_text,
        modelAnswer: question.model_answer,
        marks: question.marks,
        wordLimit: question.word_limit,
      });
      setAnswer('');
      toast({ title: 'Answer submitted!', description: 'AI evaluation complete.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  if (!question) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <p className="text-muted-foreground mt-4">Question not found or loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to questions
      </Button>

      {/* Question Card */}
      <Card className="border-emerald-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{question.marks} marks</Badge>
            {question.word_limit && <Badge variant="outline">{question.word_limit} words limit</Badge>}
            {question.year && <Badge variant="secondary">PYQ {question.year}</Badge>}
            <Badge variant="secondary" className="capitalize">{question.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-lg leading-relaxed">{question.question_text}</p>
          {question.topic && (
            <p className="text-sm text-muted-foreground mt-3">Topic: {question.topic}</p>
          )}
        </CardContent>
      </Card>

      {/* Answer Writing Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Write Your Answer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Write your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[200px] text-sm"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${question.word_limit && wordCount > question.word_limit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {wordCount} words{question.word_limit ? ` / ${question.word_limit}` : ''}
            </span>
            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || submitMutation.isPending}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              {submitMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit for AI Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Model Answer */}
      {question.model_answer && (
        <Card>
          <CardHeader>
            <Button variant="ghost" className="justify-start gap-2 p-0 h-auto" onClick={() => setShowModel(!showModel)}>
              <BookOpen className="h-4 w-4" />
              <span className="text-base font-semibold">{showModel ? 'Hide' : 'Show'} Model Answer</span>
            </Button>
          </CardHeader>
          {showModel && (
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{question.model_answer}</p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Previous Attempts */}
      {!loadingAnswers && userAnswers && userAnswers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Your Previous Attempts</h3>
          {userAnswers.map((ua) => (
            <Card key={ua.id} className="border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(ua.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {ua.ai_score !== null && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 gap-1">
                      <Star className="h-3 w-3" /> {ua.ai_score}/{question.marks}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">{ua.answer_text}</p>
                {ua.ai_feedback && (
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">AI Feedback</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{ua.ai_feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
