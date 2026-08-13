import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AlphabetNumberLine from '@/components/AlphabetNumberLine';

export default function SscReasoningAlphabet() {
  const nav = useNavigate();
  const [tab, setTab] = useState<'visual' | 'practice'>('visual');

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="-ml-2" onClick={() => nav('/ssc/reasoning/practice')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Practice
      </Button>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><span className="text-3xl">🔤</span> Alphabet</h1>
        <p className="text-muted-foreground">Visualiser se position sense banao, phir problems solve karo.</p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant={tab === 'visual' ? 'default' : 'outline'} onClick={() => setTab('visual')}>Alphabet Visualiser</Button>
        <Button size="sm" variant={tab === 'practice' ? 'default' : 'outline'} onClick={() => setTab('practice')}>Practice Problems</Button>
      </div>

      {tab === 'visual' ? (
        <div className="space-y-4">
          <AlphabetNumberLine
            dir="ltr"
            title="Left → Right number line"
            subtitle="1 = A … 26 = Z, 27 = A again · 0 = Z, −1 = Y · −1000 se 1000 tak"
          />
          <AlphabetNumberLine
            dir="rtl"
            title="Right → Left number line"
            subtitle="Same mapping, ulti direction — 1 = A left-wards badhta hua"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'forward', icon: '🔤', title: 'Alphabet Position (A = 1)', desc: 'A-1, E-5, O-15, T-20 — seedha order.' },
            { key: 'reverse', icon: '🔁', title: 'Reverse Order (A = 26)', desc: 'A-26, B-25, Z-1 — ulta order.' },
            { key: 'complementary-letters', icon: '➕', title: 'Complementary Letter Pairs', desc: 'A↔Z, B↔Y … sum = 27 · 100 MCQs.', to: '/ssc/english/drill/complementary-letters' },
          ].map((c) => (
            <Card key={c.key} className="cursor-pointer hover:shadow-md hover:border-emerald-400 transition-shadow"
              onClick={() => nav(c.to ?? `/ssc/english/practice/alphabet/${c.key}`)}>
              <CardContent className="p-6">
                <div className="text-3xl mb-2">{c.icon}</div>
                <h3 className="text-lg font-bold">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
