import { useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, Lightbulb, Target, Zap, Star, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CoachResponseProps {
  response: string;
  isStreaming: boolean;
  responseRef: React.RefObject<HTMLDivElement>;
}

interface ParsedSection {
  type: 'coach-intro' | 'conversation' | 'goldmine' | 'punchline' | 'technique' | 'opportunity' | 'tip' | 'markdown';
  content: string;
  meta?: string;
}

const parseResponse = (text: string): ParsedSection[] => {
  if (!text.trim()) return [];

  const sections: ParsedSection[] = [];
  const lines = text.split('\n');
  let currentSection: ParsedSection | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (currentSection) {
      currentSection.content = buffer.join('\n').trim();
      if (currentSection.content) sections.push(currentSection);
    } else if (buffer.length > 0) {
      const content = buffer.join('\n').trim();
      if (content) sections.push({ type: 'markdown', content });
    }
    buffer = [];
    currentSection = null;
  };

  for (const line of lines) {
    const lower = line.toLowerCase().trim();

    // Detect Comedy Goldmine sections
    if (lower.includes('comedy goldmine') || lower.includes('goldmine') || lower.includes('humor opportunity') || lower.includes('comedy opportunity')) {
      flush();
      currentSection = { type: 'goldmine', content: '', meta: line.replace(/[#*]/g, '').trim() };
      continue;
    }

    // Detect Punchline sections
    if (/^(###?\s*)?(punchline|joke|comeback|response option|option)\s*\d/i.test(lower) || lower.startsWith('punchline')) {
      flush();
      currentSection = { type: 'punchline', content: '', meta: line.replace(/[#*]/g, '').trim() };
      continue;
    }

    // Detect Technique mentions
    if (lower.startsWith('technique:') || lower.startsWith('**technique') || lower.includes('comedy technique')) {
      flush();
      currentSection = { type: 'technique', content: '', meta: line.replace(/[#*:]/g, '').trim() };
      continue;
    }

    // Detect Opportunity Rate
    if (lower.includes('opportunity rate') || lower.includes('difficulty') || lower.includes('skill level')) {
      flush();
      currentSection = { type: 'opportunity', content: '', meta: line.replace(/[#*]/g, '').trim() };
      continue;
    }

    // Detect tips/advice sections
    if (lower.includes('pro tip') || lower.includes('coach tip') || lower.includes('remember:') || lower.includes('key takeaway') || lower.includes('homework') || lower.includes('practice')) {
      flush();
      currentSection = { type: 'tip', content: '', meta: line.replace(/[#*]/g, '').trim() };
      continue;
    }

    buffer.push(line);
  }

  flush();

  // If nothing was parsed into special sections, return as markdown
  if (sections.length === 0 && text.trim()) {
    return [{ type: 'markdown', content: text }];
  }

  return sections;
};

const getDifficultyColor = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes('easy') || lower.includes('beginner') || lower.includes('safe')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (lower.includes('medium') || lower.includes('intermediate')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  if (lower.includes('hard') || lower.includes('advanced') || lower.includes('edgy') || lower.includes('expert')) return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-primary/20 text-primary border-primary/30';
};

const SectionRenderer = ({ section, index }: { section: ParsedSection; index: number }) => {
  switch (section.type) {
    case 'goldmine':
      return (
        <div className="rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-amber-300 text-base">{section.meta || 'Comedy Goldmine 🔥'}</h3>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        </div>
      );

    case 'punchline':
      return (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <h4 className="font-semibold text-primary text-sm">{section.meta || `Punchline ${index + 1}`}</h4>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm pl-8">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        </div>
      );

    case 'technique':
      return (
        <div className="flex flex-wrap items-start gap-2 py-2">
          <Badge variant="outline" className="bg-violet-500/15 text-violet-300 border-violet-500/30 gap-1 text-xs">
            <Target className="w-3 h-3" />
            {section.meta || 'Technique'}
          </Badge>
          {section.content && (
            <span className="text-sm text-muted-foreground">{section.content}</span>
          )}
        </div>
      );

    case 'opportunity':
      return (
        <div className="flex items-center gap-2 py-1">
          <Badge variant="outline" className={`gap-1 text-xs ${getDifficultyColor(section.content || section.meta || '')}`}>
            <TrendingUp className="w-3 h-3" />
            {section.meta || 'Opportunity'}
          </Badge>
          {section.content && (
            <span className="text-xs text-muted-foreground">{section.content}</span>
          )}
        </div>
      );

    case 'tip':
      return (
        <div className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20">
              <Lightbulb className="w-4 h-4 text-sky-400" />
            </div>
            <h4 className="font-semibold text-sky-300 text-sm">{section.meta || 'Coach Tip'}</h4>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm pl-8">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        </div>
      );

    case 'markdown':
    default:
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{section.content}</ReactMarkdown>
        </div>
      );
  }
};

const CoachResponse = ({ response, isStreaming, responseRef }: CoachResponseProps) => {
  const sections = useMemo(() => parseResponse(response), [response]);

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
            {isStreaming ? 'Analyzing your comedy potential...' : 'Analysis complete — let\'s level up!'}
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

      {/* Response Body */}
      <div
        ref={responseRef}
        className="bg-card/80 border border-border rounded-xl p-5 max-h-[60vh] overflow-y-auto space-y-4"
      >
        {sections.map((section, i) => (
          <SectionRenderer key={i} section={section} index={i} />
        ))}
        {isStreaming && (
          <span className="inline-block w-2 h-5 bg-primary animate-pulse rounded-sm" />
        )}
      </div>

      {/* Star Rating Footer (after streaming) */}
      {!isStreaming && response.length > 100 && (
        <div className="flex items-center gap-2 px-1 pt-1">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-muted-foreground">
            Keep practicing! Every conversation is a comedy set waiting to happen.
          </span>
        </div>
      )}
    </div>
  );
};

export default CoachResponse;
