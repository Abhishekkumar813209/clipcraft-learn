import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer } from 'lucide-react';

interface ChapterCard { slug: string; icon: string; title: string; desc: string; count: string; }

const POWERS: ChapterCard[] = [
  { slug: 'squares',  icon: '🟦', title: 'Squares',       desc: 'Pick range + serial/random + difficulty', count: '2 → 100' },
  { slug: 'sqroots',  icon: '√',  title: 'Square Roots',  desc: 'Perfect-square roots MCQ drill',           count: '2 → 100' },
  { slug: 'cubes',    icon: '🧊', title: 'Cubes',         desc: 'Rapid-fire cubes with tricky distractors', count: '2 → 30' },
  { slug: 'cbroots',  icon: '∛',  title: 'Cube Roots',    desc: 'Unit-digit trick blocked in medium mode',  count: '2 → 30' },
];

const PERCENT: ChapterCard[] = [
  { slug: 'pct-conv', icon: '½', title: 'Fraction ↔ Decimal & Mixed', desc: 'Dec→Frac, Frac→Dec, Mixed→Improper (standard mixed only)', count: '140+ questions' },
  { slug: 'pct-calc', icon: '✖️', title: '% / Decimal Multiplication', desc: '33.33% of 90, 125% of 54, 88.88% of 45', count: '200+ questions' },
];

const ADD: ChapterCard[] = [
  { slug: 'add-2-2', icon: '➕', title: '2-digit + 2-digit', desc: 'Speed addition drills', count: '100 questions' },
  { slug: 'add-2-3', icon: '➕', title: '2-digit + 3-digit', desc: 'Mixed-width addition',  count: '100 questions' },
  { slug: 'add-3-3', icon: '➕', title: '3-digit + 3-digit', desc: 'Big-number addition',   count: '100 questions' },
];

const SUB: ChapterCard[] = [
  { slug: 'sub-2-1', icon: '➖', title: '2-digit − 1-digit', desc: 'Warm-up subtraction',   count: '100 questions' },
  { slug: 'sub-2-2', icon: '➖', title: '2-digit − 2-digit', desc: 'Speed subtraction',     count: '100 questions' },
  { slug: 'sub-3-2', icon: '➖', title: '3-digit − 2-digit', desc: 'Mixed subtraction',     count: '100 questions' },
  { slug: 'sub-3-3', icon: '➖', title: '3-digit − 3-digit', desc: 'Big-number subtraction',count: '100 questions' },
];

const MUL: ChapterCard[] = [
  { slug: 'mul-2-1', icon: '✖️', title: '2-digit × 1-digit', desc: 'Fast multiplication',   count: '100 questions' },
  { slug: 'mul-2-2', icon: '✖️', title: '2-digit × 2-digit', desc: 'Cross multiplication',  count: '100 questions' },
  { slug: 'mul-3-2', icon: '✖️', title: '3-digit × 2-digit', desc: 'Mid-heavy multiplication', count: '100 questions' },
  { slug: 'mul-3-3', icon: '✖️', title: '3-digit × 3-digit', desc: 'Pro-level mental math', count: '100 questions' },
];

const DIV: ChapterCard[] = [
  { slug: 'div-2-1', icon: '➗', title: '2-digit ÷ 1-digit', desc: 'Clean quotients',       count: '100 questions' },
  { slug: 'div-3-1', icon: '➗', title: '3-digit ÷ 1-digit', desc: 'Speed division',        count: '100 questions' },
  { slug: 'div-3-2', icon: '➗', title: '3-digit ÷ 2-digit', desc: 'Long-division mental',  count: '100 questions' },
];

function Section({ title, subtitle, cards, onOpen }: { title: string; subtitle?: string; cards: ChapterCard[]; onOpen: (slug: string) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card
            key={c.slug}
            className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
            onClick={() => onOpen(c.slug)}
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

export default function SscMathsCalculation() {
  const nav = useNavigate();
  const open = (slug: string) => nav(`/ssc/maths/calculation/${slug}`);
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Button variant="ghost" size="sm" onClick={() => nav('/ssc/maths')} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back to Maths
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="text-3xl">🧮</span> Calculation Speed Drills
        </h1>
        <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
          <Timer className="w-4 h-4" /> Timed MCQ practice — build mental-maths speed
        </p>
      </div>

      <Section title="Powers & Roots" subtitle="Configurable range · Serial or Random · Easy / Medium" cards={POWERS} onOpen={open} />
      <Section title="Percentage" cards={PERCENT} onOpen={open} />
      <Section title="Mental Maths · Addition"       cards={ADD} onOpen={open} />
      <Section title="Mental Maths · Subtraction"    cards={SUB} onOpen={open} />
      <Section title="Mental Maths · Multiplication" cards={MUL} onOpen={open} />
      <Section title="Mental Maths · Division"       cards={DIV} onOpen={open} />
    </div>
  );
}
