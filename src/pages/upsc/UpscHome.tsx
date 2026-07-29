import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { UPSC_SUBJECTS } from '@/lib/upscSubjects';

export default function UpscHome() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">UPSC Prep</h1>
          <p className="text-sm text-slate-500">NCERT-based MCQ bank — subject-wise chapter practice</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {UPSC_SUBJECTS.map((s) => (
            <Card
              key={s.slug}
              className="bg-white/80 border-amber-100 backdrop-blur shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => nav(`/upsc/${s.slug}`)}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <span className="text-3xl">{s.emoji}</span>
                <div>
                  <h3 className="font-semibold">{s.label}</h3>
                  <p className="text-xs text-slate-500">{s.blurb}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
