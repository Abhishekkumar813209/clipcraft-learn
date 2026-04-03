import { useEffect, useMemo } from 'react';
import { Zap, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CoachResponseProps {
  response: string;
  isStreaming: boolean;
  responseRef: React.RefObject<HTMLDivElement>;
}

interface Punchline {
  number: number;
  text: string;
}

const parsePunchlines = (text: string): Punchline[] => {
  if (!text.trim()) return [];
  const lines = text.split('\n');
  const punchlines: Punchline[] = [];

  for (const line of lines) {
    const match = line.trim().match(/^(\d{1,2})\.\s+(.+)/);
    if (match) {
      const num = parseInt(match[1]);
      if (num >= 1 && num <= 10) {
        punchlines.push({ number: num, text: match[2] });
      }
    }
  }
  return punchlines;
};

const CoachResponse = ({ response, isStreaming, responseRef }: CoachResponseProps) => {
  const punchlines = useMemo(() => parsePunchlines(response), [response]);

  useEffect(() => {
    if (responseRef.current && isStreaming) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response, isStreaming, responseRef]);

  if (!response) return null;

  return (
    <div className="space-y-3">
      {/* Coach Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-lg shrink-0">
          🎤
        </div>
        <div>
          <p className="font-bold text-sm">Your Humor Coach</p>
          <p className="text-xs text-muted-foreground">
            {isStreaming ? 'Cooking up punchlines...' : '10 punchlines ready — pick your favourite!'}
          </p>
        </div>
        {isStreaming && (
          <div className="ml-auto flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>

      {/* Punchlines */}
      <div
        ref={responseRef}
        className="bg-card/80 border border-border rounded-xl p-5 max-h-[60vh] overflow-y-auto space-y-3"
      >
        {punchlines.length > 0 ? (
          punchlines.map((p) => (
            <div
              key={p.number}
              className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4 flex items-start gap-3"
            >
              <div className="p-1.5 rounded-lg bg-primary/20 shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary mr-2">#{p.number}</span>
                <span className="text-sm">{p.text}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
        {isStreaming && (
          <span className="inline-block w-2 h-5 bg-primary animate-pulse rounded-sm" />
        )}
      </div>

      {/* Footer */}
      {!isStreaming && punchlines.length > 0 && (
        <div className="flex items-center gap-2 px-1 pt-1">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-muted-foreground">
            Practice these in your next conversation — timing is everything!
          </span>
        </div>
      )}
    </div>
  );
};

export default CoachResponse;
