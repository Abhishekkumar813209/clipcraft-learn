import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserRow {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  activity: {
    attempts: number;
    correct: number;
    sessions: number;
    byCategory: Record<string, { attempts: number; correct: number }>;
    byDay: Record<string, number>;
  };
}

export default function AdminUsers() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-user-activity');
        if (error) throw error;
        const d = data as { users: UserRow[]; error?: string };
        if (d.error) throw new Error(d.error);
        setRows(d.users || []);
      } catch (e) {
        setError(String((e as Error).message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  if (loading) return <div className="p-6 flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading users…</div>;
  if (error) return <div className="p-6 text-rose-600 text-sm">Error: {error}</div>;

  const totalUsers = rows.length;
  const activeUsers = rows.filter((r) => r.activity.attempts > 0).length;
  const totalAttempts = rows.reduce((s, r) => s + r.activity.attempts, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold">Users · Last 7 days</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Signed up</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{totalUsers}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Active (7d)</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{activeUsers}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Attempts (7d)</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{totalAttempts}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Signed up</th>
                <th className="text-left p-3">Last sign-in</th>
                <th className="text-right p-3">Attempts</th>
                <th className="text-right p-3">Correct</th>
                <th className="text-right p-3">Sessions</th>
                {days.map((d) => (
                  <th key={d} className="text-right p-2 font-mono">{d.slice(5)}</th>
                ))}
                <th className="text-left p-3">Categories</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-muted/20">
                  <td className="p-3">
                    <div className="font-medium">{r.display_name || r.email?.split('@')[0]}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{r.created_at?.slice(0, 10)}</td>
                  <td className="p-3 text-xs text-muted-foreground">{r.last_sign_in_at?.slice(0, 10) || '—'}</td>
                  <td className="p-3 text-right font-semibold">{r.activity.attempts}</td>
                  <td className="p-3 text-right text-emerald-700">{r.activity.correct}</td>
                  <td className="p-3 text-right">{r.activity.sessions}</td>
                  {days.map((d) => {
                    const c = r.activity.byDay[d] || 0;
                    return (
                      <td key={d} className="p-1 text-center">
                        <div
                          className="mx-auto rounded"
                          style={{
                            width: 22, height: 22,
                            background: c === 0 ? 'hsl(var(--muted))' : `hsl(160 60% ${Math.max(30, 80 - Math.min(50, c))}%)`,
                            color: c > 0 ? 'white' : 'transparent',
                            fontSize: 10, lineHeight: '22px',
                          }}
                          title={`${d}: ${c} attempts`}
                        >{c || '·'}</div>
                      </td>
                    );
                  })}
                  <td className="p-3 text-xs">
                    {Object.entries(r.activity.byCategory).length === 0 ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(r.activity.byCategory).map(([k, v]) => (
                          <span key={k} className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">
                            {k}: {v.attempts}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
