import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, PlayCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSscHistory, clearSscHistory, type SscHistoryEntry } from '@/lib/sscHistory';

function formatWhen(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function SscHistory() {
  const [entries, setEntries] = useState<SscHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getSscHistory());
  }, []);

  const hasAny = entries.length > 0;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recent Practice</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Jump back into your last two SSC practice sessions.
          </p>
        </div>
        {hasAny && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearSscHistory();
              setEntries([]);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {!hasAny ? (
        <Card className="p-10 text-center border-dashed">
          <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">No recent sessions yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start any practice quiz and it will appear here so you can resume it later.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {entries.map((e) => (
            <Card key={e.url} className="p-4 flex items-center gap-4 hover:border-primary/40 transition">
              <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{e.section}</div>
                <div className="font-medium text-foreground truncate">{e.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{formatWhen(e.timestamp)}</div>
              </div>
              <Button asChild size="sm">
                <Link to={e.url}>Resume</Link>
              </Button>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Note: Only the last 2 sessions are kept. Resuming reopens the same quiz configuration — progress within a
        running quiz is not persisted mid-question.
      </p>
    </div>
  );
}
