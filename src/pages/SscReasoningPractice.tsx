import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SscReasoningPractice() {
  const nav = useNavigate();
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" onClick={() => nav('/ssc/reasoning')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Reasoning
      </Button>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><span className="text-3xl">⚡</span> Practice</h1>
        <p className="text-muted-foreground">Reasoning ki base skills — speed ke liye daily drills.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md hover:border-emerald-400 transition-shadow" onClick={() => nav('/ssc/reasoning/practice/alphabet')}>
          <CardContent className="p-6">
            <div className="text-3xl mb-2">🔤</div>
            <h3 className="text-lg font-bold">Alphabet</h3>
            <p className="text-sm text-muted-foreground mt-1">Number line visualiser (−1000 → 1000) + practice problems.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
