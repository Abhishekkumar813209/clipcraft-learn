import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Clock, Flame, Timer, TrendingUp, Zap, BookOpen, Coffee, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

const TIMETABLE: TimeSlot[] = [
  { start: '10:30', end: '13:30', type: 'study', label: 'Morning Study', icon: 'sun' },
  { start: '13:30', end: '14:30', type: 'break', label: 'Lunch Break', icon: 'coffee' },
  { start: '14:30', end: '17:30', type: 'study', label: 'Afternoon Study', icon: 'book' },
  { start: '17:30', end: '18:45', type: 'break', label: 'Evening Break', icon: 'coffee' },
  { start: '18:45', end: '20:00', type: 'study', label: 'Evening Study', icon: 'book' },
  { start: '20:00', end: '21:00', type: 'break', label: 'Dinner Break', icon: 'coffee' },
  { start: '21:00', end: '23:59', type: 'study', label: 'Night Study', icon: 'moon' },
];

const SLOT_ICONS = {
  sun: Sun,
  coffee: Coffee,
  book: BookOpen,
  moon: Moon,
};

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
  const slotProgress = currentSlot ? getSlotProgress(now, currentSlot) : 0;

  // Circular progress ring for work completion
  const circleRadius = 58;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (workPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-[hsl(230,15%,8%)] text-white">
      {/* Full-screen nudge overlay */}
      {showFullScreenNudge && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
          style={{ background: 'radial-gradient(circle at center, hsl(0 80% 20%), hsl(0 0% 3%))' }}
          onClick={() => setShowFullScreenNudge(false)}
        >
          <Timer className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
          <p className="text-5xl font-bold mb-4 tracking-tight">Time's up.</p>
          <p className="text-2xl text-white/70">Get up now. Go to the library.</p>
          <p className="text-sm text-white/30 mt-10">Click anywhere to dismiss</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Productivity Coach</h1>
            <p className="text-xs text-white/40">Real-time intelligent study tracker</p>
          </div>
        </div>

        {/* Clock Hero */}
        <div
          className="rounded-2xl p-6 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(230 20% 14%), hsl(250 20% 10%))',
            boxShadow: currentSlot?.type === 'study'
              ? '0 0 60px hsl(142 70% 40% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.05)'
              : '0 0 60px hsl(45 90% 50% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.05)',
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: currentSlot?.type === 'study'
                ? 'radial-gradient(ellipse at 50% 0%, hsl(142 70% 45% / 0.4), transparent 70%)'
                : currentSlot?.type === 'break'
                  ? 'radial-gradient(ellipse at 50% 0%, hsl(45 90% 55% / 0.3), transparent 70%)'
                  : 'radial-gradient(ellipse at 50% 0%, hsl(220 60% 50% / 0.2), transparent 70%)',
            }}
          />

          <div className="relative z-10 space-y-3">
            <div className="text-6xl font-mono font-bold tracking-[0.15em] tabular-nums"
              style={{ color: currentSlot?.type === 'study' ? 'hsl(142 70% 55%)' : currentSlot?.type === 'break' ? 'hsl(45 90% 65%)' : 'hsl(220 60% 65%)' }}
            >
              {timeString}
            </div>
            <p className="text-white/50 text-sm">
              Remaining today: <span className="text-white/80 font-semibold">{formatDuration(remainingDaySeconds)}</span>
            </p>

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: currentSlot?.type === 'study'
                  ? 'hsl(142 70% 40% / 0.15)'
                  : currentSlot?.type === 'break'
                    ? 'hsl(45 90% 50% / 0.15)'
                    : 'hsl(220 40% 50% / 0.15)',
                border: `1px solid ${currentSlot?.type === 'study' ? 'hsl(142 70% 40% / 0.3)' : currentSlot?.type === 'break' ? 'hsl(45 90% 50% / 0.3)' : 'hsl(220 40% 50% / 0.3)'}`,
              }}
            >
              <span className={`w-2 h-2 rounded-full ${currentSlot?.type === 'study' ? 'bg-green-400 animate-pulse' : currentSlot?.type === 'break' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
              <span style={{ color: currentSlot?.type === 'study' ? 'hsl(142 70% 65%)' : currentSlot?.type === 'break' ? 'hsl(45 90% 70%)' : 'hsl(220 60% 70%)' }}>
                {currentSlot
                  ? currentSlot.type === 'study'
                    ? `STUDY TIME — ${currentSlot.label}`
                    : `BREAK — ${currentSlot.label}`
                  : 'Outside scheduled hours'}
              </span>
            </div>

            {/* Slot progress bar */}
            {currentSlot && (
              <div className="mt-3">
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${slotProgress}%`,
                      background: currentSlot.type === 'study'
                        ? 'linear-gradient(90deg, hsl(142 70% 45%), hsl(160 70% 50%))'
                        : 'linear-gradient(90deg, hsl(45 90% 50%), hsl(35 90% 55%))',
                    }}
                  />
                </div>
                <p className="text-xs text-white/30 mt-1">
                  {currentSlot.type === 'study' ? 'You should be studying right now.' : 'Recharge. Next session coming up.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progress + Ring */}
        <div className="grid grid-cols-[1fr_auto] gap-5">
          {/* Left: bars */}
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{ background: 'hsl(230 15% 12%)', border: '1px solid hsl(230 15% 18%)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4" style={{ color: 'hsl(142 70% 55%)' }} />
              <span className="text-sm font-semibold text-white/80">Progress</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/50">Day</span>
                <span className="text-white/70 font-medium">{Math.round(dayProgressPercent)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${dayProgressPercent}%`, background: 'linear-gradient(90deg, hsl(220 70% 50%), hsl(260 70% 60%))' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/50">Work</span>
                <span className="text-white/70 font-medium">{Math.round(workPercent)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${workPercent}%`, background: 'linear-gradient(90deg, hsl(142 70% 45%), hsl(170 70% 50%))' }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Planned</label>
                <Input
                  type="number" min={0} max={24} step={0.5}
                  value={plannedHours}
                  onChange={e => handlePlannedChange(parseFloat(e.target.value) || 0)}
                  className="bg-white/5 border-white/10 text-white h-9 text-sm focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Actual</label>
                <Input
                  type="number" min={0} max={24} step={0.5}
                  value={actualHours}
                  onChange={e => handleActualChange(parseFloat(e.target.value) || 0)}
                  className="bg-white/5 border-white/10 text-white h-9 text-sm focus:border-green-500/50"
                />
              </div>
            </div>
          </div>

          {/* Right: circular ring */}
          <div
            className="rounded-2xl p-4 flex flex-col items-center justify-center min-w-[160px]"
            style={{ background: 'hsl(230 15% 12%)', border: '1px solid hsl(230 15% 18%)' }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70" cy="70" r={circleRadius}
                fill="none"
                stroke="hsl(230 15% 20%)"
                strokeWidth="8"
              />
              <circle
                cx="70" cy="70" r={circleRadius}
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(142 70% 50%)" />
                  <stop offset="100%" stopColor="hsl(200 80% 55%)" />
                </linearGradient>
              </defs>
              <text x="70" y="62" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold" fontFamily="monospace">
                {Math.round(workPercent)}%
              </text>
              <text x="70" y="82" textAnchor="middle" fill="hsl(0 0% 60%)" fontSize="10">
                completed
              </text>
            </svg>
            <p className="text-xs text-white/40 mt-2 text-center">{remainingWork.toFixed(1)}h remaining</p>
          </div>
        </div>

        {/* Pressure message */}
        <div
          className="rounded-xl px-4 py-3 text-center text-sm font-medium"
          style={{
            background: 'linear-gradient(135deg, hsl(230 20% 14%), hsl(240 15% 12%))',
            border: '1px solid hsl(230 15% 20%)',
            color: 'hsl(45 80% 70%)',
          }}
        >
          ⚡ {getPressureMessage()}
        </div>

        {/* AI Motivation */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            background: 'linear-gradient(135deg, hsl(15 60% 12%), hsl(230 15% 10%))',
            border: '1px solid hsl(15 50% 20%)',
          }}
        >
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5" style={{ color: 'hsl(25 95% 60%)' }} />
            <span className="font-semibold">AI Motivation</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => fetchAI('motivate')}
              disabled={aiLoading}
              className="flex-1 h-10 font-semibold text-sm border-0"
              style={{
                background: 'linear-gradient(135deg, hsl(25 90% 50%), hsl(15 85% 45%))',
                color: 'white',
              }}
            >
              {aiLoading ? '⏳ Thinking...' : '🔥 Get Motivation'}
            </Button>
            <Button
              onClick={() => fetchAI('reflect')}
              disabled={reflectionLoading}
              className="flex-1 h-10 font-semibold text-sm bg-white/5 hover:bg-white/10 text-white/80 border border-white/10"
            >
              {reflectionLoading ? '⏳ Thinking...' : '📝 Daily Review'}
            </Button>
          </div>
          {aiMessage && (
            <div className="rounded-xl p-4 text-sm leading-relaxed"
              style={{ background: 'hsl(25 80% 50% / 0.1)', border: '1px solid hsl(25 80% 50% / 0.2)', color: 'hsl(25 80% 75%)' }}
            >
              {aiMessage}
            </div>
          )}
          {reflectionMessage && (
            <div className="rounded-xl p-4 text-sm leading-relaxed"
              style={{ background: 'hsl(220 60% 50% / 0.1)', border: '1px solid hsl(220 60% 50% / 0.2)', color: 'hsl(220 60% 75%)' }}
            >
              {reflectionMessage}
            </div>
          )}
        </div>

        {/* Underconfidence Breaker */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            background: 'linear-gradient(135deg, hsl(160 40% 10%), hsl(230 15% 10%))',
            border: '1px solid hsl(160 40% 18%)',
          }}
        >
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" style={{ color: 'hsl(160 70% 55%)' }} />
            <span className="font-semibold">Underconfidence Breaker</span>
          </div>
          <p
            className="text-center text-lg font-semibold italic py-2 transition-opacity duration-700"
            style={{ color: 'hsl(160 50% 70%)' }}
          >
            "{NUDGES[nudgeIndex]}"
          </p>

          {libraryCountdown !== null ? (
            <div className="text-center space-y-3 py-2">
              <div className="text-4xl font-mono font-bold tabular-nums" style={{ color: 'hsl(0 80% 65%)' }}>
                {Math.floor(libraryCountdown / 60)}:{String(libraryCountdown % 60).padStart(2, '0')}
              </div>
              <p className="text-sm text-white/40">You promised. Clock is ticking.</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLibraryCountdown(null)}
                className="text-white/30 hover:text-white/60 hover:bg-white/5"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              className="w-full h-11 font-semibold text-sm border-0"
              style={{ background: 'linear-gradient(135deg, hsl(142 60% 40%), hsl(160 60% 35%))', color: 'white' }}
              onClick={() => {
                setLibraryCountdown(600);
                toast.success("10 minute countdown started. Get ready!");
              }}
            >
              🏫 I will go to the library in 10 minutes
            </Button>
          )}
        </div>

        {/* Timetable */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'hsl(230 15% 12%)', border: '1px solid hsl(230 15% 18%)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-white/50" />
            <span className="font-semibold text-sm text-white/80">Today's Timetable</span>
          </div>
          <div className="space-y-1.5">
            {TIMETABLE.map((slot, i) => {
              const isActive = currentSlot === slot;
              const isPast = now.getHours() * 60 + now.getMinutes() >= parseTime(slot.end);
              const SlotIcon = SLOT_ICONS[slot.icon];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300"
                  style={{
                    background: isActive
                      ? slot.type === 'study'
                        ? 'hsl(142 60% 35% / 0.15)'
                        : 'hsl(45 80% 50% / 0.12)'
                      : 'transparent',
                    border: isActive
                      ? `1px solid ${slot.type === 'study' ? 'hsl(142 60% 40% / 0.3)' : 'hsl(45 80% 50% / 0.25)'}`
                      : '1px solid transparent',
                    opacity: isPast && !isActive ? 0.4 : 1,
                  }}
                >
                  <SlotIcon className="h-3.5 w-3.5 flex-shrink-0" style={{
                    color: isActive
                      ? slot.type === 'study' ? 'hsl(142 70% 55%)' : 'hsl(45 90% 65%)'
                      : 'hsl(0 0% 40%)',
                  }} />
                  <span className={`flex-1 ${isActive ? 'font-semibold' : 'text-white/60'}`}
                    style={isActive ? { color: slot.type === 'study' ? 'hsl(142 70% 70%)' : 'hsl(45 90% 70%)' } : {}}
                  >
                    {slot.label}
                  </span>
                  <span className="text-white/30 text-xs font-mono">{slot.start} – {slot.end}</span>
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
