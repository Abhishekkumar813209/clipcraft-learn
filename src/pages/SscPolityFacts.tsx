import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { POLITY_SHEETS, polityCounts } from '@/lib/polityQuiz';

export default function SscPolityFacts() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" className="text-emerald-700 -ml-2" onClick={() => nav('/ssc/gk/polity')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Polity
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏛️</span>
          <div>
            <h1 className="text-3xl font-bold">Polity Practice</h1>
            <p className="text-sm text-slate-500">Master data sheets se banaye gaye fact-recall MCQs — har sheet ka apna quiz.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POLITY_SHEETS.map((s) => (
            <Card
              key={s.key}
              className="cursor-pointer border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all bg-white/80"
              onClick={() => nav(`/ssc/gk/polity/facts/${s.key}`)}
            >
              <CardContent className="p-5 flex items-start gap-3">
                <span className="text-3xl">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{s.label}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{s.blurb}</p>
                  <p className="text-xs text-emerald-700 mt-1.5 font-medium">{polityCounts[s.key] || 0} facts</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
