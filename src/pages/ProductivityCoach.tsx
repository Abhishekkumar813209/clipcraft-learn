import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { BarChart, Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Clock, Flame, Timer, TrendingUp, Zap, BookOpen, Coffee, Moon, Sun, Trophy, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TimeSlot {
  start: string;
  end: string;
  type: 'study' | 'break';
  label: string;
  icon: 'sun' | 'coffee' | 'book' | 'moon';
}

interface DayLog {
  date: string;
  planned_hours: number;
  actual_hours: number;
  ai_score: number | null;
}

const TIMETABLE: TimeSlot[] = [
  { start: '10:30', end: '12:30', type: 'study', label: 'Morning Study', icon: 'sun' },
  { start: '12:30', end: '14:00', type: 'break', label: 'Lunch Break', icon: 'coffee' },
  { start: '14:00', end: '16:00', type: 'study', label: 'Afternoon Study', icon: 'book' },
  { start: '16:00', end: '17:30', type: 'break', label: 'Evening Break', icon: 'coffee' },
  { start: '17:30', end: '19:30', type: 'study', label: 'Evening Study', icon: 'book' },
  { start: '19:30', end: '20:30', type: 'break', label: 'Dinner Break', icon: 'coffee' },
  { start: '20:30', end: '22:30', type: 'study', label: 'Night Study', icon: 'moon' },
];

const SLOT_ICONS = { sun: Sun, coffee: Coffee, book: BookOpen, moon: Moon };

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

function getSlotProgress(now: Date, slot: TimeSlot): number {
  const mins = now.getHours() * 60 + now.getMinutes();
  const start = parseTime(slot.start);
  const end = parseTime(slot.end);
  if (mins <= start) return 0;
  if (mins >= end) return 100;
  return ((mins - start) / (end - start)) * 100;
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

function getContribColor(ratio: number): string {
  if (ratio <= 0) return 'hsl(210 10% 90%)';
  if (ratio < 0.25) return 'hsl(142 40% 82%)';
  if (ratio < 0.5) return 'hsl(142 50% 65%)';
  if (ratio < 0.75) return 'hsl(142 60% 48%)';
  return 'hsl(142 70% 35%)';
}

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function ProductivityCoach() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());
  const [plannedHours, setPlannedHours] = useState(6);
  const [actualHours, setActualHours] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [reflectionMessage, setReflectionMessage] = useState('');
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [lastAiScore, setLastAiScore] = useState<number | null>(null);
  const [libraryCountdown, setLibraryCountdown] = useState<number | null>(null);
  const [showFullScreenNudge, setShowFullScreenNudge] = useState(false);
  const [nudgeIndex, setNudgeIndex] = useState(0);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<DayLog[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch today + last 30 days history
  useEffect(() => {
    if (!user) { setDbLoaded(true); return; }
    const today = new Date().toISOString().slice(0, 10);
    const thirtyAgo = new Date();
    thirtyAgo.setDate(thirtyAgo.getDate() - 30);
    const fromDate = thirtyAgo.toISOString().slice(0, 10);

    supabase
      .from('productivity_logs')
      .select('date, planned_hours, actual_hours, ai_score')
      .eq('user_id', user.id)
      .gte('date', fromDate)
      .order('date', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setHistoryLogs(data.map(d => ({
            date: d.date,
            planned_hours: Number(d.planned_hours),
            actual_hours: Number(d.actual_hours),
            ai_score: d.ai_score != null ? Number(d.ai_score) : null,
          })));
          const todayRow = data.find(r => r.date === today);
          if (todayRow) {
            setPlannedHours(Number(todayRow.planned_hours));
            setActualHours(Number(todayRow.actual_hours));
            if (todayRow.ai_score != null) setLastAiScore(Number(todayRow.ai_score));
          }
        }
        setDbLoaded(true);
      });
  }, [user]);

  // Keep historyLogs in sync with live edits so charts update immediately
  useEffect(() => {
    if (!dbLoaded) return;
    const today = new Date().toISOString().slice(0, 10);
    setHistoryLogs(prev => {
      const idx = prev.findIndex(l => l.date === today);
      const entry: DayLog = { date: today, planned_hours: plannedHours, actual_hours: actualHours, ai_score: lastAiScore };
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = entry;
        return updated;
      }
      return [...prev, entry];
    });
  }, [plannedHours, actualHours, lastAiScore, dbLoaded]);

  const saveToDb = useCallback((planned: number, actual: number, score?: number) => {
    if (!user) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      const today = new Date().toISOString().slice(0, 10);
      const row: any = { user_id: user.id, date: today, planned_hours: planned, actual_hours: actual, updated_at: new Date().toISOString() };
      if (score !== undefined) row.ai_score = score;
      await supabase.from('productivity_logs').upsert(row, { onConflict: 'user_id,date' });
    }, 1000);
  }, [user]);

  const handlePlannedChange = (val: number) => { setPlannedHours(val); saveToDb(val, actualHours); };
  const handleActualChange = (val: number) => { setActualHours(val); saveToDb(plannedHours, val); };

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

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

  useEffect(() => {
    const id = setInterval(() => setNudgeIndex(i => (i + 1) % NUDGES.length), 8000);
    return () => clearInterval(id);
  }, []);

  const currentSlot = getCurrentSlot(now);
  const remainingStudyMins = getRemainingStudyMinutes(now);
  const remainingStudyHours = (remainingStudyMins / 60).toFixed(1);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const remainingDaySeconds = Math.max(0, (endOfDay.getTime() - now.getTime()) / 1000);
  const dayProgressPercent = ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400) * 100;
  const workPercent = plannedHours > 0 ? Math.min(100, (actualHours / plannedHours) * 100) : 0;
  const remainingWork = Math.max(0, plannedHours - actualHours);

  const circleRadius = 54;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (workPercent / 100) * circumference;

  // Dashboard stats
  const last30 = useMemo(() => getLast30Days(), []);
  const logMap = useMemo(() => {
    const m: Record<string, DayLog> = {};
    historyLogs.forEach(l => { m[l.date] = l; });
    return m;
  }, [historyLogs]);

  const activeDays = historyLogs.filter(l => l.actual_hours > 0).length;
  const avgScore = useMemo(() => {
    const scored = historyLogs.filter(l => l.ai_score != null && l.ai_score > 0);
    if (scored.length === 0) return 0;
    return Math.round(scored.reduce((a, b) => a + (b.ai_score || 0), 0) / scored.length);
  }, [historyLogs]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = last30.length - 1; i >= 0; i--) {
      const log = logMap[last30[i]];
      if (log && log.actual_hours > 0) streak++;
      else break;
    }
    return streak;
  }, [last30, logMap]);

  const weeklyData = useMemo(() => {
    const days = last30.slice(-7);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => {
      const log = logMap[day];
      const d = new Date(day + 'T00:00:00');
      const planned = log?.planned_hours ?? 0;
      const actual = log?.actual_hours ?? 0;
      const completion = planned > 0 ? Math.min(Math.round((actual / planned) * 100), 100) : 0;
      return {
        day: dayNames[d.getDay()],
        date: day,
        Planned: planned,
        Actual: actual,
        'Goal %': completion,
      };
    });
  }, [last30, logMap]);

  const selectedDayData = useMemo(() => {
    if (!selectedDay) return null;
    return weeklyData.find(d => d.date === selectedDay) || null;
  }, [selectedDay, weeklyData]);

  const getPressureMessage = () => {
    if (currentSlot?.type === 'break') return `This is your ${currentSlot.label}. Rest well, you'll need it.`;
    const remStudy = parseFloat(remainingStudyHours);
    if (actualHours === 0 && currentSlot?.type === 'study') return `You have only ${remainingStudyHours}h of study time left today. Start now.`;
    if (remainingWork <= 0) return "Great work! You've hit your target. Keep the momentum.";
    if (remainingWork > remStudy)
      return `You planned ${plannedHours}h, done ${actualHours}h. Only ${remainingStudyHours}h study time left — push hard!`;
    return `You planned ${plannedHours}h. You've done ${actualHours}h. ${remainingWork.toFixed(1)}h still possible.`;
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
      if (mode === 'reflect' && data?.score != null) {
        const score = Number(data.score);
        setLastAiScore(score);
        saveToDb(plannedHours, actualHours, score);
      }
    } catch (e: any) {
      toast.error('AI call failed: ' + (e.message || 'Unknown error'));
    } finally {
      loader(false);
    }
  }, [remainingStudyHours, workPercent, plannedHours, actualHours, currentSlot, saveToDb]);

  const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const slotProgress = currentSlot ? getSlotProgress(now, currentSlot) : 0;

  const statusColor = currentSlot?.type === 'study' ? 'hsl(142 70% 40%)' : currentSlot?.type === 'break' ? 'hsl(38 90% 45%)' : 'hsl(220 50% 50%)';
  const statusBg = currentSlot?.type === 'study' ? 'hsl(142 60% 95%)' : currentSlot?.type === 'break' ? 'hsl(38 80% 95%)' : 'hsl(220 40% 95%)';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Full-screen nudge overlay */}
      {showFullScreenNudge && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer bg-black/90"
          onClick={() => setShowFullScreenNudge(false)}
        >
          <Timer className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
          <p className="text-5xl font-bold mb-4 tracking-tight text-white">Time's up.</p>
          <p className="text-2xl text-white/70">Get up now. Go to the library.</p>
          <p className="text-sm text-white/30 mt-10">Click anywhere to dismiss</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Productivity Coach</h1>
            <p className="text-xs text-muted-foreground">Real-time intelligent study tracker</p>
          </div>
        </div>

        {/* ===== Monthly Dashboard ===== */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Monthly Activity</span>
          </div>
          {/* Contribution grid */}
          <div className="flex gap-1 flex-wrap">
            {last30.map(day => {
              const log = logMap[day];
              const ratio = log ? (log.planned_hours > 0 ? log.actual_hours / log.planned_hours : 0) : 0;
              const dayNum = new Date(day).getDate();
              return (
                <div key={day} className="relative group">
                  <div
                    className="w-7 h-7 rounded-md cursor-default transition-transform hover:scale-110"
                    style={{ background: getContribColor(ratio) }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 whitespace-nowrap">
                    <div className="bg-foreground text-background text-[10px] px-2 py-1 rounded-md shadow-lg">
                      {day} — {log ? `${log.actual_hours}/${log.planned_hours}h` : 'No data'}
                      {log?.ai_score != null ? ` | Score: ${log.ai_score}` : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>Less</span>
            {[0, 0.15, 0.35, 0.6, 0.9].map((r, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ background: getContribColor(r) }} />
            ))}
            <span>More</span>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-accent/50 p-3 text-center">
              <div className="text-xl font-bold text-primary">{activeDays}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Days</div>
            </div>
            <div className="rounded-xl bg-accent/50 p-3 text-center">
              <div className="text-xl font-bold flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-amber-600">{avgScore}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Score</div>
            </div>
            <div className="rounded-xl bg-accent/50 p-3 text-center">
              <div className="text-xl font-bold flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-orange-600">{currentStreak}d</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Streak</div>
            </div>
          </div>
        </div>

        {/* ===== Weekly Bar Chart ===== */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Weekly Overview</span>
            </div>
            {selectedDay && (
              <button onClick={() => setSelectedDay(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                ✕ Clear selection
              </button>
            )}
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weeklyData} barGap={4} barCategoryGap="20%" onClick={(e: any) => {
                if (e?.activePayload?.[0]?.payload?.date) {
                  setSelectedDay(e.activePayload[0].payload.date);
                }
              }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="hours" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} unit="h" width={35} />
                <YAxis yAxisId="percent" orientation="right" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} width={40} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem', fontSize: 12 }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar yAxisId="hours" dataKey="Planned" fill="hsl(220 70% 60%)" radius={[6, 6, 0, 0]} cursor="pointer" />
                <Bar yAxisId="hours" dataKey="Actual" fill="hsl(142 60% 45%)" radius={[6, 6, 0, 0]} cursor="pointer" />
                <Line yAxisId="percent" type="monotone" dataKey="Goal %" stroke="hsl(35 90% 55%)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(35 90% 55%)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {/* Selected day detail */}
          {selectedDayData && (
            <div className="rounded-xl bg-accent/50 border border-border p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-sm font-semibold text-foreground">{selectedDayData.day} — {selectedDayData.date}</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold" style={{ color: 'hsl(220 70% 60%)' }}>{selectedDayData.Planned}h</p>
                  <p className="text-xs text-muted-foreground">Planned</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'hsl(142 60% 45%)' }}>{selectedDayData.Actual}h</p>
                  <p className="text-xs text-muted-foreground">Actual</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'hsl(35 90% 55%)' }}>{selectedDayData['Goal %']}%</p>
                  <p className="text-xs text-muted-foreground">Goal</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== Clock Hero ===== */}
        <div className="rounded-2xl p-6 text-center border border-border bg-card relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at 50% 0%, ${statusColor} / 0.15, transparent 70%)` }} />
          <div className="relative z-10 space-y-3">
            <div className="text-5xl font-mono font-bold tracking-[0.12em] tabular-nums" style={{ color: statusColor }}>
              {timeString}
            </div>
            <p className="text-muted-foreground text-sm">
              Remaining today: <span className="text-foreground font-semibold">{formatDuration(remainingDaySeconds)}</span>
            </p>
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: statusBg, color: statusColor, border: `1px solid ${statusColor}33` }}>
              <span className={`w-2 h-2 rounded-full ${currentSlot?.type === 'study' ? 'animate-pulse' : ''}`} style={{ background: statusColor }} />
              {currentSlot ? (currentSlot.type === 'study' ? `STUDY TIME — ${currentSlot.label}` : `BREAK — ${currentSlot.label}`) : 'Outside scheduled hours'}
            </div>
            {/* Slot progress bar */}
            {currentSlot && (
              <div className="mt-3">
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${slotProgress}%`, background: statusColor }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentSlot.start} – {currentSlot.end} ({Math.round(slotProgress)}% elapsed)
                  {currentSlot.type === 'study' ? ' • You should be studying right now.' : ' • Recharge for next session.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===== Progress + Ring ===== */}
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="rounded-2xl p-5 space-y-4 border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Progress</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Day</span>
                <span className="font-medium">{Math.round(dayProgressPercent)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${dayProgressPercent}%`, background: 'hsl(220 70% 55%)' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Work</span>
                <span className="font-medium">{Math.round(workPercent)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${workPercent}%`, background: 'hsl(142 60% 45%)' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Planned</label>
                <Input type="number" min={0} max={24} step={0.5} value={plannedHours} onChange={e => handlePlannedChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Actual</label>
                <Input type="number" min={0} max={24} step={0.5} value={actualHours} onChange={e => handleActualChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 flex flex-col items-center justify-center min-w-[155px] border border-border bg-card">
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={circleRadius} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <circle cx="65" cy="65" r={circleRadius} fill="none" stroke="url(#ringGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} transform="rotate(-90 65 65)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(142 70% 45%)" />
                  <stop offset="100%" stopColor="hsl(200 80% 50%)" />
                </linearGradient>
              </defs>
              <text x="65" y="60" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="24" fontWeight="bold" fontFamily="monospace">{Math.round(workPercent)}%</text>
              <text x="65" y="78" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">completed</text>
            </svg>
            <p className="text-xs text-muted-foreground mt-1 text-center">{remainingWork.toFixed(1)}h remaining</p>
          </div>
        </div>

        {/* Pressure message */}
        <div className="rounded-xl px-4 py-3 text-center text-sm font-medium border border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800/30 dark:text-amber-300">
          ⚡ {getPressureMessage()}
        </div>

        {/* ===== AI Motivation ===== */}
        <div className="rounded-2xl p-5 space-y-4 border border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">AI Motivation</span>
            </div>
            {lastAiScore != null && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Target className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-bold text-primary">{lastAiScore}/100</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => fetchAI('motivate')}
              disabled={aiLoading}
              className="flex-1 h-10 font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, hsl(25 90% 50%), hsl(15 85% 45%))', color: 'white' }}
            >
              {aiLoading ? '⏳ Thinking...' : '🔥 Get Motivation'}
            </Button>
            <Button
              onClick={() => fetchAI('reflect')}
              disabled={reflectionLoading}
              variant="outline"
              className="flex-1 h-10 font-semibold text-sm"
            >
              {reflectionLoading ? '⏳ Thinking...' : '📝 Daily Review'}
            </Button>
          </div>
          {aiMessage && (
            <div className="rounded-xl p-4 text-sm leading-relaxed bg-orange-50 border border-orange-200 text-orange-900 dark:bg-orange-950/20 dark:border-orange-800/30 dark:text-orange-300">
              {aiMessage}
            </div>
          )}
          {reflectionMessage && (
            <div className="rounded-xl p-4 text-sm leading-relaxed bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-800/30 dark:text-blue-300">
              {reflectionMessage}
            </div>
          )}
        </div>

        {/* ===== Underconfidence Breaker ===== */}
        <div className="rounded-2xl p-5 space-y-4 border border-border bg-card">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold">Underconfidence Breaker</span>
          </div>
          <p className="text-center text-lg font-semibold italic py-2 transition-opacity duration-700 text-emerald-700 dark:text-emerald-400">
            "{NUDGES[nudgeIndex]}"
          </p>

          {libraryCountdown !== null ? (
            <div className="text-center space-y-3 py-2">
              <div className="text-4xl font-mono font-bold tabular-nums text-red-600 dark:text-red-400">
                {Math.floor(libraryCountdown / 60)}:{String(libraryCountdown % 60).padStart(2, '0')}
              </div>
              <p className="text-sm text-muted-foreground">You promised. Clock is ticking.</p>
              <Button variant="ghost" size="sm" onClick={() => setLibraryCountdown(null)} className="text-muted-foreground">Cancel</Button>
            </div>
          ) : (
            <Button
              className="w-full h-11 font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, hsl(142 60% 40%), hsl(160 60% 35%))', color: 'white' }}
              onClick={() => { setLibraryCountdown(600); toast.success("10 minute countdown started. Get ready!"); }}
            >
              🏫 I will go to the library in 10 minutes
            </Button>
          )}
        </div>

        {/* ===== Timetable ===== */}
        <div className="rounded-2xl p-5 border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Today's Timetable</span>
          </div>
          <div className="space-y-1.5">
            {TIMETABLE.map((slot, i) => {
              const isActive = currentSlot === slot;
              const isPast = now.getHours() * 60 + now.getMinutes() >= parseTime(slot.end);
              const SlotIcon = SLOT_ICONS[slot.icon];
              const slotColor = slot.type === 'study' ? 'hsl(142 60% 40%)' : 'hsl(38 80% 45%)';
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300"
                  style={{
                    background: isActive ? (slot.type === 'study' ? 'hsl(142 60% 95%)' : 'hsl(38 80% 95%)') : 'transparent',
                    border: isActive ? `1px solid ${slotColor}33` : '1px solid transparent',
                    opacity: isPast && !isActive ? 0.4 : 1,
                  }}
                >
                  <SlotIcon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: isActive ? slotColor : 'hsl(var(--muted-foreground))' }} />
                  <span className={`flex-1 ${isActive ? 'font-semibold' : 'text-muted-foreground'}`} style={isActive ? { color: slotColor } : {}}>
                    {slot.label}
                  </span>
                  <span className="text-muted-foreground text-xs font-mono">{slot.start} – {slot.end}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
