import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const POS = [
  { key: 'verb', label: 'Verb', icon: '🏃', active: true },
  { key: 'noun', label: 'Noun', icon: '🧱', active: false },
  { key: 'pronoun', label: 'Pronoun', icon: '👤', active: false },
  { key: 'adjective', label: 'Adjective', icon: '🎨', active: false },
  { key: 'adverb', label: 'Adverb', icon: '⚡', active: false },
  { key: 'preposition', label: 'Preposition', icon: '📍', active: false },
  { key: 'conjunction', label: 'Conjunction', icon: '🔗', active: false },
  { key: 'interjection', label: 'Interjection', icon: '❗', active: false },
];

export default function SscPartsOfSpeech() {
  const nav = useNavigate();
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back
      </Button>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><span className="text-3xl">🧩</span>Parts of Speech</h1>
        <p className="text-muted-foreground">Pick a part of speech to practice.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {POS.map(p => (
          <Card
            key={p.key}
            className={`transition-shadow border-border ${p.active ? 'cursor-pointer hover:shadow-md hover:border-emerald-400' : 'opacity-60 cursor-not-allowed'}`}
            onClick={() => p.active && nav(`/ssc/english/parts-of-speech/${p.key}`)}
          >
            <CardContent className="p-5 flex items-start gap-3">
              <span className="text-3xl">{p.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold">{p.label}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{p.active ? 'Available' : 'Coming soon'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
