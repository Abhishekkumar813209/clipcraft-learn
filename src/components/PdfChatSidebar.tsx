import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, FileText, Lightbulb, X, MessageSquare, Languages, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PdfChatSidebarProps {
  pageText: string;
  currentPage: number;
  totalPages: number;
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  onClose: () => void;
  onTranslate?: () => void;
  onQuiz?: () => void;
  /** Called once on mount so the parent can trigger a summarize from outside */
  onRegisterTrigger?: (fn: (combinedText: string, prompt: string) => void) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-chat`;

async function extractTextFromPages(doc: pdfjsLib.PDFDocumentProxy, from: number, to: number): Promise<string> {
  const texts: string[] = [];
  for (let i = from; i <= to; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const t = content.items.map((item: any) => item.str).join(' ');
    texts.push(`--- Page ${i} ---\n${t}`);
  }
  return texts.join('\n\n');
}

export function PdfChatSidebar({ pageText, currentPage, totalPages, pdfDoc, onClose, onTranslate, onQuiz, onRegisterTrigger }: PdfChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRangeSelector, setShowRangeSelector] = useState(false);
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Expose an external trigger so the top-bar Summarize button can inject a prompt
  useEffect(() => {
    if (!onRegisterTrigger) return;
    onRegisterTrigger(async (combinedText: string, prompt: string) => {
      const userMsg: Message = { role: 'user', content: prompt };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      await streamChat(newMessages, combinedText);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRegisterTrigger, messages]);

  const streamChat = async (allMessages: Message[], overridePageText?: string) => {
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
        body: JSON.stringify({ messages: allMessages, pageText: overridePageText || pageText }),
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

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    await streamChat(newMessages);
  };

  const handleSummarizeClick = () => {
    setShowRangeSelector(true);
    setRangeFrom(currentPage);
    setRangeTo(Math.min(currentPage + 4, totalPages));
  };

  const handleRangeSummarize = async () => {
    if (!pdfDoc) return;
    const from = Math.max(1, Math.min(rangeFrom, totalPages));
    const to = Math.max(from, Math.min(rangeTo, totalPages));

    if (to - from > 30) {
      toast.error('Max 30 pages at once');
      return;
    }

    setShowRangeSelector(false);
    const prompt = from === to
      ? `Summarize page ${from} in bullet points`
      : `Summarize pages ${from}-${to} in bullet points`;

    const userMsg: Message = { role: 'user', content: prompt };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    toast.info(`Extracting text from ${to - from + 1} page(s)...`);
    const combinedText = await extractTextFromPages(pdfDoc, from, to);
    await streamChat(newMessages, combinedText);
  };

  const quickAction = (prompt: string) => sendMessage(prompt);

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">AI Chat</span>
          <span className="text-xs text-muted-foreground">Page {currentPage}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-2 border-b border-border space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant="outline" className="text-xs h-7" onClick={handleSummarizeClick}>
            <Sparkles className="h-3 w-3 mr-1" /> Summarize
          </Button>
          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => quickAction('Explain this page in simple terms')}>
            <Lightbulb className="h-3 w-3 mr-1" /> Explain
          </Button>
          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => quickAction('List the key points from this page')}>
            <FileText className="h-3 w-3 mr-1" /> Key Points
          </Button>
          {onTranslate && (
            <Button size="sm" variant="outline" className="text-xs h-7" onClick={onTranslate}>
              <Languages className="h-3 w-3 mr-1" /> हिंदी में समझाओ
            </Button>
          )}
          {onQuiz && (
            <Button size="sm" variant="outline" className="text-xs h-7" onClick={onQuiz}>
              <Brain className="h-3 w-3 mr-1" /> Quiz Me
            </Button>
          )}
        </div>

        {/* Page range selector */}
        {showRangeSelector && (
          <div className="flex items-center gap-1.5 bg-muted rounded-md p-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Pages</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={rangeFrom}
              onChange={(e) => setRangeFrom(Number(e.target.value))}
              className="w-12 bg-background border border-border rounded px-1.5 py-0.5 text-xs text-center outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={rangeTo}
              onChange={(e) => setRangeTo(Number(e.target.value))}
              className="w-12 bg-background border border-border rounded px-1.5 py-0.5 text-xs text-center outline-none focus:ring-1 focus:ring-primary"
            />
            <Button size="sm" className="text-xs h-6 px-2" onClick={handleRangeSummarize} disabled={isLoading}>
              Go
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-6 px-1" onClick={() => setShowRangeSelector(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              Ask anything about the current page, or use the quick actions above.
            </p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block max-w-[95%] rounded-lg px-3 py-2 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:m-0 [&_ul]:m-0 [&_li]:m-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : msg.content}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="text-sm"><div className="inline-block bg-muted rounded-lg px-3 py-2 text-muted-foreground">Thinking...</div></div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-2 border-t border-border">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this page..."
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
