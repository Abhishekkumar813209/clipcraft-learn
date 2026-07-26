import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sprout, BookOpen, FileText } from 'lucide-react';

export default function RbiEnglish() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/rbi')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">English Language</h1>
            <p className="text-sm text-slate-500">Vocabulary, comprehension and PYQ practice for RBI Grade B</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-sky-100 to-blue-100 border-blue-100 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-blue-700" />
                  <h3 className="font-semibold text-slate-900">Root Word Vocabulary</h3>
                </div>
                <Badge className="bg-white/70 text-blue-700 border border-blue-200">219</Badge>
              </div>
              <p className="text-xs text-slate-600">
                Every word tagged with its root (e.g. LOQ — to speak), Hinglish hints and example sentences.
              </p>
              <Link to="/rbi/english/vocab">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-white">Open</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-blue-100 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-slate-900">English PYQs</h3>
              </div>
              <p className="text-xs text-slate-600">Previous-year English questions from the RBI PYQ bank.</p>
              <Link to="/rbi/practice/english">
                <Button size="sm" variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">Practice</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
