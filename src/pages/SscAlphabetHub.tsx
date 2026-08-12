import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SscAlphabetHub() {
  const nav = useNavigate();

  const cards = [
    {
      key: 'forward',
      icon: '🔤',
      title: 'Alphabet Position (A = 1)',
      desc: 'A-1, E-5, O-15, T-20 — seedha order ka number yaad karo.',
    },
    {
      key: 'reverse',
      icon: '🔁',
      title: 'Reverse Order (A = 26)',
      desc: 'A-26, B-25, Z-1 — ulta order ka number practice karo.',
    },
    {
      key: 'complementary-letters',
      icon: '🔁',
      title: 'Complementary Letter Pairs',
      desc: 'A↔Z, B↔Y … position sum = 27 · 100 MCQs.',
      to: '/ssc/english/drill/complementary-letters',
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english')} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back
      </Button>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><span className="text-3xl">⚡</span>Practice</h1>
        <p className="text-muted-foreground">Alphabet numbering drills — speed badhane ke liye.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Card
            key={c.key}
            className="cursor-pointer hover:shadow-md hover:border-emerald-400 transition-shadow"
            onClick={() => nav((c as { to?: string }).to ?? `/ssc/english/practice/alphabet/${c.key}`)}
          >
            <CardContent className="p-6">
              <div className="text-3xl mb-2">{c.icon}</div>
              <h3 className="text-lg font-bold">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
