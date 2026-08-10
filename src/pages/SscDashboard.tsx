import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const SUBJECT_CARDS = [
  { key: 'maths', label: 'Maths', icon: '🔢', blurb: 'Calculation drills, trainers & chapterwise practice', to: '/ssc/maths' },
  { key: 'reasoning', label: 'Reasoning', icon: '🧠', blurb: 'Analogy, series, puzzles, coding-decoding', to: '/ssc/reasoning' },
  { key: 'english', label: 'English', icon: '🔤', blurb: 'Black Book, grammar rules & PYQ question bank', to: '/ssc/english' },
  { key: 'gk', label: 'GK / GS', icon: '🌍', blurb: 'History, Polity, Geography, Economy, Biology', to: '/ssc/gk' },
];

export default function SscDashboard() {
  const nav = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SSC Prep 👋</h1>
        <p className="text-muted-foreground">Subject chuno aur practice shuru karo.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUBJECT_CARDS.map((s) => (
          <Card
            key={s.key}
            className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-emerald-300"
            onClick={() => nav(s.to)}
          >
            <CardContent className="p-6 flex items-start gap-4">
              <span className="text-4xl">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-foreground">{s.label}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{s.blurb}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
