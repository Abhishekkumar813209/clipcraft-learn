import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const META: Record<string, { label: string; icon: string }> = {
  verb: { label: 'Verb', icon: '🏃' },
  tense: { label: 'Tense', icon: '⏳' },
  passive_voice: { label: 'Passive Voice', icon: '🔄' },
  narration: { label: 'Narration', icon: '💬' },
};

const SPLIT_TOPICS: Record<string, { spotKey: string; mcqKey: string; spotDesc: string; mcqDesc: string }> = {
  passive_voice: {
    spotKey: 'passive_voice', mcqKey: 'passive_voice_mcq',
    spotDesc: 'Find the passive-voice error in each sentence.',
    mcqDesc: 'Choose the correct passive form from the options.',
  },
  narration: {
    spotKey: 'narration_spot', mcqKey: 'narration_mcq',
    spotDesc: 'Find the reported-speech error in each sentence.',
    mcqDesc: 'Choose the correct direct/indirect speech form.',
  },
};

export default function SscGrammarTopic() {
  const nav = useNavigate();
  const { pos = 'verb' } = useParams();
  const m = META[pos] || { label: pos, icon: '📘' };
  const split = SPLIT_TOPICS[pos];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back
      </Button>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><span className="text-3xl">{m.icon}</span>{m.label}</h1>
        <p className="text-muted-foreground">Pick a level.</p>
      </div>

      {split ? (
        <div className="space-y-4">
          <div className="text-xs font-semibold tracking-wider uppercase text-emerald-700">Basic</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md hover:border-emerald-400 transition-shadow" onClick={() => nav(`/ssc/english/grammar/${split.spotKey}/basic`)}>
              <CardContent className="p-6">
                <div className="text-xs font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-100 inline-block px-2 py-0.5 rounded mb-2">Available</div>
                <h3 className="text-lg font-bold">Spot the Error</h3>
                <p className="text-sm text-muted-foreground mt-1">{split.spotDesc}</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md hover:border-emerald-400 transition-shadow" onClick={() => nav(`/ssc/english/grammar/${split.mcqKey}/basic`)}>
              <CardContent className="p-6">
                <div className="text-xs font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-100 inline-block px-2 py-0.5 rounded mb-2">Available</div>
                <h3 className="text-lg font-bold">MCQs</h3>
                <p className="text-sm text-muted-foreground mt-1">{split.mcqDesc}</p>
              </CardContent>
            </Card>
          </div>
          <Card className="opacity-60 cursor-not-allowed">
            <CardContent className="p-6">
              <div className="text-xs font-semibold tracking-wider uppercase text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded mb-2">Coming soon</div>
              <h3 className="text-lg font-bold">Advanced</h3>
              <p className="text-sm text-muted-foreground mt-1">Harder mixed drills for {m.label.toLowerCase()}.</p>
            </CardContent>
          </Card>
        </div>
      ) : (
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
      )}
    </div>
  );
}
