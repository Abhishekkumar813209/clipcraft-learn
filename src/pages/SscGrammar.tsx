import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TOPICS = [
  { key: 'verb', label: 'Verb', icon: '🏃', desc: 'Verb forms, agreement, common mistakes.' },
  { key: 'tense', label: 'Tense', icon: '⏳', desc: 'Since/for, past perfect, sequence of tenses.' },
  { key: 'passive_voice', label: 'Passive Voice', icon: '🔄', desc: 'Active vs passive, modal passives, prepositions.' },
];

export default function SscGrammar() {
  const nav = useNavigate();
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back
      </Button>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><span className="text-3xl">📚</span>Grammar</h1>
        <p className="text-muted-foreground">Pick a grammar topic to practice.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map(t => (
          <Card
            key={t.key}
            className="cursor-pointer hover:shadow-md hover:border-emerald-400 transition-shadow border-border"
            onClick={() => nav(`/ssc/english/grammar/${t.key}`)}
          >
            <CardContent className="p-5 flex items-start gap-3">
              <span className="text-3xl">{t.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold">{t.label}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{t.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
