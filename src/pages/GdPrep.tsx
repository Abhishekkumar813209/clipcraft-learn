import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Send, Loader2, Timer, Play, Pause, RotateCcw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { gdTopics, categoryLabels, type GdCategory, type GdTopic } from "@/data/gdTopics";
import { gdTips } from "@/data/gdTips";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

// ─── Topic Bank Tab ───
function TopicBankTab() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GdCategory | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = gdTopics.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as GdCategory | "all")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(Object.entries(categoryLabels) as [GdCategory, string][]).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} topics found</p>

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-2 pr-3">
          {filtered.map((topic) => (
            <TopicCard key={topic.id} topic={topic} expanded={expandedId === topic.id} onToggle={() => setExpandedId(expandedId === topic.id ? null : topic.id)} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function TopicCard({ topic, expanded, onToggle }: { topic: GdTopic; expanded: boolean; onToggle: () => void }) {
  return (
    <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={onToggle}>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Badge variant="secondary" className="text-xs shrink-0">{categoryLabels[topic.category]}</Badge>
            <span className="font-medium text-sm truncate">{topic.title}</span>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 px-4 pb-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold text-green-600">Points FOR</span>
              </div>
              <ul className="space-y-1">
                {topic.pointsFor.map((p, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-green-500 shrink-0">•</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ThumbsDown className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold text-red-600">Points AGAINST</span>
              </div>
              <ul className="space-y-1">
                {topic.pointsAgainst.map((p, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-red-500 shrink-0">•</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── AI Practice Tab ───
function AiPracticeTab() {
  const [topic, setTopic] = useState("");
  const [args, setArgs] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!topic.trim() || !args.trim()) {
      toast({ title: "Please enter both topic and your arguments", variant: "destructive" });
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const { data, error } = await supabase.functions.invoke("gd-feedback", {
        body: { topic: topic.trim(), arguments: args.trim() },
      });
      if (error) throw error;
      setFeedback(data);
    } catch (err: any) {
      toast({ title: "Error getting feedback", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const pickRandom = () => {
    const r = gdTopics[Math.floor(Math.random() * gdTopics.length)];
    setTopic(r.title);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">GD Topic</label>
          <div className="flex gap-2">
            <Input placeholder="Enter a GD topic or pick one..." value={topic} onChange={(e) => setTopic(e.target.value)} />
            <Button variant="outline" size="sm" onClick={pickRandom} className="shrink-0">Random</Button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Your Arguments</label>
          <Textarea
            placeholder="Write what you would say in the GD... Include your opening, key points, examples, and how you would conclude."
            value={args}
            onChange={(e) => setArgs(e.target.value)}
            className="min-h-[250px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">{args.split(/\s+/).filter(Boolean).length} words</p>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="w-full gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {loading ? "Analyzing..." : "Get AI Feedback"}
        </Button>
      </div>

      <div>
        {loading && (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">AI is evaluating your arguments...</p>
            </div>
          </Card>
        )}
        {feedback && !feedback.raw && <FeedbackDisplay feedback={feedback} />}
        {feedback?.raw && (
          <Card>
            <CardContent className="pt-6 prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{feedback.raw}</ReactMarkdown>
            </CardContent>
          </Card>
        )}
        {!loading && !feedback && (
          <Card className="h-full flex items-center justify-center border-dashed">
            <div className="text-center space-y-2 p-8">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Write your arguments and click "Get AI Feedback" to receive detailed evaluation</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function FeedbackDisplay({ feedback }: { feedback: any }) {
  const scores = [
    { label: "Content", score: feedback.content?.score, feedback: feedback.content?.feedback },
    { label: "Communication", score: feedback.communication?.score, feedback: feedback.communication?.feedback },
    { label: "Persuasiveness", score: feedback.persuasiveness?.score, feedback: feedback.persuasiveness?.feedback },
    { label: "Structure", score: feedback.structure?.score, feedback: feedback.structure?.feedback },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-320px)]">
      <div className="space-y-4 pr-3">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
            <p className="text-4xl font-bold text-primary">{feedback.overallScore}/10</p>
          </CardContent>
        </Card>

        {scores.map((s) => s.score != null && (
          <Card key={s.label}>
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{s.label}</span>
                <Badge variant={s.score >= 7 ? "default" : s.score >= 5 ? "secondary" : "destructive"}>{s.score}/10</Badge>
              </div>
              <Progress value={s.score * 10} className="h-2" />
              <p className="text-xs text-muted-foreground">{s.feedback}</p>
            </CardContent>
          </Card>
        ))}

        {feedback.strongPoints?.length > 0 && (
          <Card>
            <CardHeader className="py-3"><CardTitle className="text-sm text-green-600">What You Did Well</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1">
                {feedback.strongPoints.map((p: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-green-500">✓</span>{p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {feedback.improvements?.length > 0 && (
          <Card>
            <CardHeader className="py-3"><CardTitle className="text-sm text-amber-600">Areas to Improve</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1">
                {feedback.improvements.map((p: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-amber-500">→</span>{p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {feedback.sampleResponse && (
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader className="py-3"><CardTitle className="text-sm text-blue-600">Model Response</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground italic">{feedback.sampleResponse}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}

// ─── Tips Tab ───
function TipsTab() {
  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="grid md:grid-cols-2 gap-4 pr-3">
        {gdTips.map((section) => (
          <Card key={section.id}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1.5">
                {section.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

// ─── Mock Timer Tab ───
function MockTimerTab() {
  const [prepTime, setPrepTime] = useState(2);
  const [speakTime, setSpeakTime] = useState(3);
  const [phase, setPhase] = useState<"idle" | "prep" | "speak" | "done">("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [randomTopic, setRandomTopic] = useState<GdTopic | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = phase === "prep" ? prepTime * 60 : speakTime * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }, []);

  const startSession = () => {
    const t = gdTopics[Math.floor(Math.random() * gdTopics.length)];
    setRandomTopic(t);
    setPhase("prep");
    setSecondsLeft(prepTime * 60);
  };

  useEffect(() => {
    if (phase === "idle" || phase === "done") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playBeep();
          if (phase === "prep") {
            setPhase("speak");
            return speakTime * 60;
          } else {
            setPhase("done");
            setSessionCount((c) => c + 1);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, speakTime, playBeep]);

  const reset = () => {
    setPhase("idle");
    setSecondsLeft(0);
    setRandomTopic(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {phase === "idle" && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <h3 className="font-semibold text-center">Mock GD Timer</h3>
            <p className="text-sm text-muted-foreground text-center">Practice with timed phases. A random topic will be shown.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Prep Time (min)</label>
                <Select value={String(prepTime)} onValueChange={(v) => setPrepTime(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 min</SelectItem>
                    <SelectItem value="2">2 min</SelectItem>
                    <SelectItem value="3">3 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Speak Time (min)</label>
                <Select value={String(speakTime)} onValueChange={(v) => setSpeakTime(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 min</SelectItem>
                    <SelectItem value="3">3 min</SelectItem>
                    <SelectItem value="5">5 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={startSession} className="w-full gap-2"><Play className="h-4 w-4" />Start Session</Button>
            {sessionCount > 0 && <p className="text-xs text-center text-muted-foreground">Sessions completed today: {sessionCount}</p>}
          </CardContent>
        </Card>
      )}

      {(phase === "prep" || phase === "speak") && (
        <Card className={phase === "prep" ? "border-amber-500/40 bg-amber-500/5" : "border-green-500/40 bg-green-500/5"}>
          <CardContent className="pt-6 space-y-5">
            <Badge variant={phase === "prep" ? "secondary" : "default"} className="mx-auto block w-fit text-sm">
              {phase === "prep" ? "🧠 THINKING PHASE" : "🎤 SPEAKING PHASE"}
            </Badge>

            {randomTopic && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Topic</p>
                <p className="font-semibold">{randomTopic.title}</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-6xl font-mono font-bold tabular-nums">{formatTime(secondsLeft)}</p>
            </div>

            <Progress value={progress} className="h-3" />

            <p className="text-sm text-center text-muted-foreground">
              {phase === "prep" ? "Organize your thoughts, jot down key points" : "Present your arguments clearly and confidently"}
            </p>

            <Button variant="outline" onClick={reset} className="w-full gap-2"><RotateCcw className="h-4 w-4" />Reset</Button>
          </CardContent>
        </Card>
      )}

      {phase === "done" && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="pt-6 space-y-4 text-center">
            <p className="text-4xl">🎉</p>
            <h3 className="font-semibold">Session Complete!</h3>
            <p className="text-sm text-muted-foreground">Great practice! Try another topic or review tips to improve.</p>
            <p className="text-xs text-muted-foreground">Total sessions: {sessionCount}</p>
            <div className="flex gap-3">
              <Button onClick={startSession} className="flex-1 gap-2"><Play className="h-4 w-4" />New Session</Button>
              <Button variant="outline" onClick={reset} className="flex-1 gap-2"><RotateCcw className="h-4 w-4" />Reset</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Main Page ───
export default function GdPrep() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display font-bold text-lg">GD Preparation</h1>
            <p className="text-xs text-muted-foreground">Master Group Discussions for placements</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="topics">
          <TabsList className="mb-6">
            <TabsTrigger value="topics">📚 Topic Bank</TabsTrigger>
            <TabsTrigger value="practice">🤖 AI Practice</TabsTrigger>
            <TabsTrigger value="tips">💡 Tips & Strategy</TabsTrigger>
            <TabsTrigger value="timer">⏱️ Mock Timer</TabsTrigger>
          </TabsList>

          <TabsContent value="topics"><TopicBankTab /></TabsContent>
          <TabsContent value="practice"><AiPracticeTab /></TabsContent>
          <TabsContent value="tips"><TipsTab /></TabsContent>
          <TabsContent value="timer"><MockTimerTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
