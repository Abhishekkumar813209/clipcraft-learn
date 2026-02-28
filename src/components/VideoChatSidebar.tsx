import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, MessageSquare, Lightbulb, Clock, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { formatDuration } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface VideoChatSidebarProps {
  videoId: string;
  videoTitle: string;
  currentTime: number;
  onClose: () => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/video-chat`;

export function VideoChatSidebar({ videoId, videoTitle, currentTime, onClose }: VideoChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Time range mode for "explain this section"
  const [rangeMode, setRangeMode] = useState(false);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const streamChat = async (allMessages: Message[], startTime?: number, endTime?: number) => {
    setIsLoading(true);
    let assistantSoFar = '';

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          videoId,
          videoTitle,
          currentTime: Math.floor(currentTime),
          ...(startTime !== undefined && { startTime }),
          ...(endTime !== undefined && { endTime }),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }));
        toast.error(err.error || 'AI request failed');
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to get AI response');
    }
    setIsLoading(false);
  };

  const sendMessage = async (content: string, startTime?: number, endTime?: number) => {
    if (!content.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    await streamChat(newMessages, startTime, endTime);
  };

  const handleRangeExplain = () => {
    const start = parseSimpleTime(rangeStart);
    const end = parseSimpleTime(rangeEnd);
    if (start === null || end === null || start >= end) {
      toast.error('Please enter valid start and end times');
      return;
    }
    setRangeMode(false);
    sendMessage(
      `Explain in detail what the instructor is teaching from ${rangeStart} to ${rangeEnd}`,
      start,
      end
    );
    setRangeStart('');
    setRangeEnd('');
  };

  const quickAction = (prompt: string) => sendMessage(prompt);

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">AI Doubt Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-2 border-b border-border space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm" variant="outline" className="text-xs h-7"
            onClick={() => quickAction(`What is the instructor explaining at ${formatDuration(Math.floor(currentTime))}? Explain it in detail.`)}
            disabled={isLoading}
          >
            <Lightbulb className="h-3 w-3 mr-1" /> Explain this
          </Button>
          <Button
            size="sm" variant="outline" className="text-xs h-7"
            onClick={() => quickAction('Summarize what has been taught so far in bullet points')}
            disabled={isLoading}
          >
            <Sparkles className="h-3 w-3 mr-1" /> Summarize
          </Button>
          <Button
            size="sm" variant="outline" className="text-xs h-7"
            onClick={() => setRangeMode(!rangeMode)}
            disabled={isLoading}
          >
            <Clock className="h-3 w-3 mr-1" /> Explain Section
          </Button>
          <Button
            size="sm" variant="outline" className="text-xs h-7"
            onClick={() => quickAction('Quiz me on what was just explained. Give me 3 MCQs.')}
            disabled={isLoading}
          >
            <Brain className="h-3 w-3 mr-1" /> Quiz Me
          </Button>
        </div>

        {/* Time range selector */}
        {rangeMode && (
          <div className="flex items-center gap-1.5 bg-muted rounded-md p-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">From</span>
            <input
              placeholder="0:00"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="w-14 bg-background border border-border rounded px-1.5 py-0.5 text-xs text-center outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <input
              placeholder="5:00"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="w-14 bg-background border border-border rounded px-1.5 py-0.5 text-xs text-center outline-none focus:ring-1 focus:ring-primary"
            />
            <Button size="sm" className="text-xs h-6 px-2" onClick={handleRangeExplain} disabled={isLoading}>
              Go
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-6 px-1" onClick={() => setRangeMode(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Current time indicator */}
      <div className="px-3 py-1.5 border-b border-border bg-muted/50">
        <span className="text-xs text-muted-foreground">
          ⏱ Current: <span className="font-mono text-primary font-semibold">{formatDuration(Math.floor(currentTime))}</span>
        </span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-xs text-muted-foreground">
                Video pause karo aur poochho kuch bhi! 🎓
              </p>
              <p className="text-xs text-muted-foreground">
                AI transcript se video ka content padhta hai aur tumhe samjhata hai.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block max-w-[95%] rounded-lg px-3 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:m-0 [&_ul]:m-0 [&_li]:m-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="text-sm">
              <div className="inline-block bg-muted rounded-lg px-3 py-2 text-muted-foreground animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-2 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-1.5"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Kuch bhi poocho..."
            className="flex-1 bg-muted rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="h-9 w-9" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

/** Parse "m:ss" or "h:mm:ss" to seconds */
function parseSimpleTime(input: string): number | null {
  if (!input.trim()) return null;
  const parts = input.trim().split(':').map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}
