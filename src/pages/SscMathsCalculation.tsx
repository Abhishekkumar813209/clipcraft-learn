import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer } from 'lucide-react';

const CHAPTERS = [
  {
    slug: 'squares',
    icon: '🟦',
    title: 'Squares & Square Roots',
    desc: 'Squares and square roots up to 100 · rapid-fire MCQs with timer',
    count: '200+ questions',
  },
  {
    slug: 'cubes',
    icon: '🧊',
    title: 'Cubes & Cube Roots',
    desc: 'Cubes and cube roots up to 20 · rapid-fire MCQs with timer',
    count: '80+ questions',
  },
  {
    slug: 'percentage',
    icon: '％',
    title: 'Percentage · Fraction Conversion',
    desc: '33.33% of 90, 12.5% of 64, 11.11% of 90, 125% of 54 … 100+ mixed decimal % drills',
    count: '150+ questions',
  },
];

export default function SscMathsCalculation() {
  const nav = useNavigate();
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => nav('/ssc/maths')} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back to Maths
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="text-3xl">🧮</span> Calculation Speed Drills
        </h1>
        <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
          <Timer className="w-4 h-4" /> Timed MCQ practice to build calculation speed
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHAPTERS.map((c) => (
          <Card
            key={c.slug}
            className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
            onClick={() => nav(`/ssc/maths/calculation/${c.slug}`)}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
                  <p className="text-xs text-primary/80 mt-2 font-medium">{c.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
