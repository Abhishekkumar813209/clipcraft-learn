import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Clock, Flame, Timer, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TimeSlot {
  start: string;
  end: string;
  type: 'study' | 'break';
  label: string;
}

const TIMETABLE: TimeSlot[] = [
  { start: '10:30', end: '13:30', type: 'study', label: 'Morning Study' },
  { start: '13:30', end: '14:30', type: 'break', label: 'Lunch Break' },
  { start: '14:30', end: '17:30', type: 'study', label: 'Afternoon Study' },
  { start: '17:30', end: '18:45', type: 'break', label: 'Evening Break' },
  { start: '18:45', end: '20:00', type: 'study', label: 'Evening Study' },
  { start: '20:00', end: '21:00', type: 'break', label: 'Dinner Break' },
  { start: '21:00', end: '23:59', type: 'study', label: 'Night Study' },
];

function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

function getCurrentSlot(now: Date): TimeSlot | null {
  const mins = now.getHours() * 60 + now.getMinutes();
  return TIMETABLE.find(s => mins >= parseTime(s.start) && mins < parseTime(s.end)) || null;
}

function getRemainingStudyMinutes(now: Date): number {
  const mins = now.getHours() * 60 + now.getMinutes();
  return TIMETABLE
    .filter(s => s.type === 'study')
    .reduce((acc, s) => {
      const start = parseTime(s.start);
      const end = parseTime(s.end);
      if (mins >= end) return acc;
      if (mins <= start) return acc + (end - start);
      return acc + (end - mins);
    }, 0);
}

const NUDGES = [
  "You don't need confidence. You need action.",
  "Just go to the library. Momentum will follow.",
  "Start with 5 minutes. That's all it takes.",
  "Your future self is watching. Make them proud.",
  "Overthinking is the enemy. Just begin.",
  "Every minute you wait is a minute lost forever.",
  "The hardest part is getting up. After that, it flows.",
];

export default function ProductivityCoach() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());
  const [plannedHours, setPlannedHours] = useState(8);
  const [actualHours, setActualHours] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [reflectionMessage, setReflectionMessage] = useState('');
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [libraryCountdown, setLibraryCountdown] = useState<number | null>(null);
  const [showFullScreenNudge, setShowFullScreenNudge] = useState(false);
  const [nudgeIndex, setNudgeIndex] = useState(0);
  const [dbLoaded, setDbLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load today's data from DB
  useEffect(() => {
    if (!user) { setDbLoaded(true); return; }
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from('productivity_logs')
      .select('planned_hours, actual_hours')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPlannedHours(Number(data.planned_hours));
          setActualHours(Number(data.actual_hours));
        }
        setDbLoaded(true);
      });
  }, [user]);

  // Debounced save to DB
  const saveToDb = useCallback((planned: number, actual: number) => {
    if (!user) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      const today = new Date().toISOString().slice(0, 10);
      await supabase.from('productivity_logs').upsert(
        { user_id: user.id, date: today, planned_hours: planned, actual_hours: actual, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,date' }
      );
    }, 1000);
  }, [user]);

  const handlePlannedChange = (val: number) => {
    setPlannedHours(val);
    saveToDb(val, actualHours);
  };
  const handleActualChange = (val: number) => {
    setActualHours(val);
    saveToDb(plannedHours, val);
  };

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Library countdown
  useEffect(() => {
    if (libraryCountdown === null) return;
    if (libraryCountdown <= 0) {
      setShowFullScreenNudge(true);
      setLibraryCountdown(null);
      return;
    }
    const id = setInterval(() => setLibraryCountdown(prev => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearInterval(id);
  }, [libraryCountdown]);

  // Rotate nudge
  useEffect(() => {
    const id = setInterval(() => setNudgeIndex(i => (i + 1) % NUDGES.length), 8000);
    return () => clearInterval(id);
  }, []);

  const currentSlot = getCurrentSlot(now);
  const remainingStudyMins = getRemainingStudyMinutes(now);
  const remainingStudyHours = (remainingStudyMins / 60).toFixed(1);

  // Remaining in day
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const remainingDaySeconds = Math.max(0, (endOfDay.getTime() - now.getTime()) / 1000);

  // Day progress
  const dayProgressPercent = ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400) * 100;

  // Work progress
  const workPercent = plannedHours > 0 ? Math.min(100, (actualHours / plannedHours) * 100) : 0;
  const remainingWork = Math.max(0, plannedHours - actualHours);

  // Smart pressure message
  const getPressureMessage = () => {
    if (currentSlot?.type === 'break') return `This is your ${currentSlot.label}. Rest well, you'll need it.`;
    if (actualHours === 0 && currentSlot?.type === 'study') return `You have only ${remainingStudyHours} hours of study time left today. Start now.`;
    if (remainingWork > 0 && remainingWork < 2) return `Still possible. Focus on what's left. ${remainingWork.toFixed(1)}h to go.`;
    if (remainingWork > 0) return `You planned ${plannedHours}h. You've done ${actualHours}h. ${remainingWork.toFixed(1)}h still possible.`;
    return "Great work! You've hit your target. Keep the momentum.";
  };

  const fetchAI = useCallback(async (mode: 'motivate' | 'reflect') => {
    const setter = mode === 'motivate' ? setAiMessage : setReflectionMessage;
    const loader = mode === 'motivate' ? setAiLoading : setReflectionLoading;
    loader(true);
    try {
      const { data, error } = await supabase.functions.invoke('productivity-coach', {
        body: {
          mode,
          remainingHours: parseFloat(remainingStudyHours),
          productivityPercent: Math.round(workPercent),
          plannedHours,
          actualHours,
          hasStarted: actualHours > 0,
          currentSlot: currentSlot?.type || 'none',
        },
      });
      if (error) throw error;
      setter(data?.message || 'Keep going!');
    } catch (e: any) {
      toast.error('AI call failed: ' + (e.message || 'Unknown error'));
    } finally {
      loader(false);
    }
  }, [remainingStudyHours, workPercent, plannedHours, actualHours, currentSlot]);

  const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Full-screen nudge overlay */}
      {showFullScreenNudge && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center cursor-pointer animate-pulse"
          onClick={() => setShowFullScreenNudge(false)}
        >
          <Timer className="w-20 h-20 text-destructive mb-6" />
          <p className="text-4xl font-bold text-white mb-4">Time's up.</p>
          <p className="text-2xl text-white/80">Get up now. Go to the library.</p>
          <p className="text-sm text-white/50 mt-8">Click anywhere to dismiss</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold font-display">Productivity Coach</h1>
        </div>

        {/* Clock Card */}
        <Card className="border-primary/30">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="text-5xl font-mono font-bold tracking-wider text-primary">
              {timeString}
            </div>
            <p className="text-muted-foreground">
              Remaining today: <span className="font-semibold text-foreground">{formatDuration(remainingDaySeconds)}</span>
            </p>
            {/* Current slot status */}
            <div className="flex items-center justify-center gap-2">
              <span className={`w-3 h-3 rounded-full ${currentSlot?.type === 'study' ? 'bg-green-500 animate-pulse' : currentSlot?.type === 'break' ? 'bg-yellow-500' : 'bg-muted'}`} />
              <span className="font-semibold text-lg">
                {currentSlot
                  ? currentSlot.type === 'study'
                    ? `STUDY TIME — ${currentSlot.label}`
                    : `BREAK — ${currentSlot.label}`
                  : 'Outside scheduled hours'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground italic">
              {currentSlot?.type === 'study'
                ? 'You should be studying right now.'
                : currentSlot?.type === 'break'
                  ? 'This is your break time. Recharge.'
                  : 'No active slot. Plan your next session.'}
            </p>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Day Progress</span>
                <span>{Math.round(dayProgressPercent)}%</span>
              </div>
              <Progress value={dayProgressPercent} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Work Completion</span>
                <span>{Math.round(workPercent)}%</span>
              </div>
              <Progress value={workPercent} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Planned (hrs)</label>
                <Input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={plannedHours}
                  onChange={e => setPlannedHours(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Actual (hrs)</label>
                <Input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={actualHours}
                  onChange={e => setActualHours(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-center bg-muted/50 rounded-lg p-3">
              {getPressureMessage()}
            </p>
          </CardContent>
        </Card>

        {/* AI Motivation */}
        <Card className="border-orange-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="h-5 w-5 text-orange-500" />
              AI Motivation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => fetchAI('motivate')}
                disabled={aiLoading}
                className="flex-1"
              >
                {aiLoading ? 'Thinking...' : '🔥 Get Motivation'}
              </Button>
              <Button
                variant="outline"
                onClick={() => fetchAI('reflect')}
                disabled={reflectionLoading}
                className="flex-1"
              >
                {reflectionLoading ? 'Thinking...' : '📝 Daily Review'}
              </Button>
            </div>
            {aiMessage && (
              <div className="bg-primary/10 rounded-lg p-4 text-sm font-medium border border-primary/20">
                {aiMessage}
              </div>
            )}
            {reflectionMessage && (
              <div className="bg-muted rounded-lg p-4 text-sm font-medium border">
                {reflectionMessage}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Underconfidence Breaker */}
        <Card className="border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-green-500" />
              Underconfidence Breaker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-lg font-semibold italic text-foreground/90">
              "{NUDGES[nudgeIndex]}"
            </p>

            {libraryCountdown !== null ? (
              <div className="text-center space-y-2">
                <div className="text-3xl font-mono font-bold text-destructive">
                  {Math.floor(libraryCountdown / 60)}:{String(libraryCountdown % 60).padStart(2, '0')}
                </div>
                <p className="text-sm text-muted-foreground">You promised. Clock is ticking.</p>
                <Button variant="ghost" size="sm" onClick={() => setLibraryCountdown(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  setLibraryCountdown(600);
                  toast.success("10 minute countdown started. Get ready!");
                }}
              >
                🏫 I will go to the library in 10 minutes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Timetable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Today's Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {TIMETABLE.map((slot, i) => {
                const isActive = currentSlot === slot;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                      isActive
                        ? slot.type === 'study'
                          ? 'bg-green-500/20 border border-green-500/40 font-semibold'
                          : 'bg-yellow-500/20 border border-yellow-500/40 font-semibold'
                        : 'bg-muted/30'
                    }`}
                  >
                    <span>{slot.label}</span>
                    <span className="text-muted-foreground">{slot.start} – {slot.end}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
