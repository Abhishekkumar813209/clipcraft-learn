import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Trash2, ChevronDown, ChevronUp, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface HistoryEntry {
  id: string;
  transcript: string;
  response: string;
  timestamp: Date;
}

const HumorCoach = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  const analyzeHumor = async () => {
    if (!transcript.trim() || isStreaming) return;
    setIsStreaming(true);
    setResponse('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/humor-coach`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: transcript.trim() }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setResponse(`❌ ${err.error || 'Something went wrong'}`);
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              setResponse(fullText);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      // Save to history
      setHistory(prev => [{
        id: crypto.randomUUID(),
        transcript: transcript.trim(),
        response: fullText,
        timestamp: new Date(),
      }, ...prev].slice(0, 20));

    } catch (err) {
      setResponse('❌ Network error. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (responseRef.current && isStreaming) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response, isStreaming]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Mic className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Humor Coach 🎤</h1>
            <p className="text-xs text-muted-foreground">Train your comedy muscle — Samay Raina style</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Input Section */}
        <div className="space-y-3">
          <Textarea
            placeholder="Paste a conversation, YouTube comment thread, WhatsApp chat, or any transcript here... The funnier the source material, the better the analysis! 🎭"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[180px] text-sm bg-card border-border resize-y"
            disabled={isStreaming}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {transcript.length} characters
            </span>
            <div className="flex gap-2">
              {transcript && !isStreaming && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTranscript('')}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Clear
                </Button>
              )}
              <Button
                onClick={analyzeHumor}
                disabled={!transcript.trim() || isStreaming}
                className="gap-2"
              >
                {isStreaming ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Analyze Humor</>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Response Section */}
        {response && (
          <div
            ref={responseRef}
            className="bg-card border border-border rounded-lg p-6 max-h-[60vh] overflow-y-auto prose prose-sm dark:prose-invert max-w-none"
          >
            <ReactMarkdown>{response}</ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
            )}
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Previous Analyses ({history.length})
            </h2>
            {history.map((entry) => (
              <div key={entry.id} className="border border-border rounded-lg bg-card/50">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                  onClick={() => setExpandedHistory(
                    expandedHistory === entry.id ? null : entry.id
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {entry.transcript.slice(0, 80)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {expandedHistory === entry.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {expandedHistory === entry.id && (
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{entry.response}</ReactMarkdown>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setTranscript(entry.transcript);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Send className="w-3 h-3 mr-1" /> Re-analyze
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HumorCoach;
