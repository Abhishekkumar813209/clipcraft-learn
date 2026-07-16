import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const META: Record<string, { label: string; icon: string }> = {
  verb: { label: 'Verb', icon: '🏃' },
  tense: { label: 'Tense', icon: '⏳' },
  passive_voice: { label: 'Passive Voice', icon: '🔄' },
};

export default function SscGrammarTopic() {
  const nav = useNavigate();
  const { pos = 'verb' } = useParams();
  const m = META[pos] || { label: pos, icon: '📘' };
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back
      </Button>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><span className="text-3xl">{m.icon}</span>{m.label}</h1>
        <p className="text-muted-foreground">Pick a level.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md hover:border-emerald-400 transition-shadow" onClick={() => nav(`/ssc/english/grammar/${pos}/basic`)}>
          <CardContent className="p-6">
            <div className="text-xs font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-100 inline-block px-2 py-0.5 rounded mb-2">Available</div>
            <h3 className="text-lg font-bold">Basic</h3>
            <p className="text-sm text-muted-foreground mt-1">Spot the error — with hints, solutions and 3 similar drills per question.</p>
          </CardContent>
        </Card>
        <Card className="opacity-60 cursor-not-allowed">
          <CardContent className="p-6">
            <div className="text-xs font-semibold tracking-wider uppercase text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded mb-2">Coming soon</div>
            <h3 className="text-lg font-bold">Advanced</h3>
            <p className="text-sm text-muted-foreground mt-1">Harder mixed drills for {m.label.toLowerCase()}.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
