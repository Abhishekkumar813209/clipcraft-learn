import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RBI_TOPIC_META, RBI_ALL_TOPICS, RBI_PHASE1_TOPICS, RBI_PHASE2_TOPICS, type RbiTopic } from '@/types/rbi';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import { ArrowLeft, Upload, FileText, Loader2, Trash2, Save, Sparkles, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface ExtractedQuestion {
  question_text: string;
  options: string[];
  correct_option: number;
  topic: RbiTopic;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

interface PageInfo {
  pageNum: number;
  text: string;
  charCount: number;
}

const BATCH_SIZE = 3;
const DELAY_MS = 1000;
const LOW_TEXT_THRESHOLD = 50;
const MAX_PAGES = 200;

export default function RbiPyqUpload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [year, setYear] = useState<string>('2024');
  const [pdfName, setPdfName] = useState<string>('');
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [pageCount, setPageCount] = useState(0);
  const [progress, setProgress] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [questionsFoundSoFar, setQuestionsFoundSoFar] = useState(0);
  const [lastExtractedRange, setLastExtractedRange] = useState('');

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast({ title: 'Invalid file', description: 'Please upload a PDF file.', variant: 'destructive' });
      return;
    }

    setPdfName(file.name);
    setProgress('Reading PDF...');
    setPages([]);
    setQuestions([]);
    setQuestionsFoundSoFar(0);
    setLastExtractedRange('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      setPageCount(totalPages);

      const loadPages = Math.min(totalPages, MAX_PAGES);
      const pageInfos: PageInfo[] = [];

      for (let i = 1; i <= loadPages; i++) {
        setProgress(`Extracting text from page ${i}/${loadPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        pageInfos.push({ pageNum: i, text: pageText, charCount: pageText.trim().length });
      }

      setPages(pageInfos);
      setStartPage('1');
      setEndPage(Math.min(50, loadPages).toString());
      setProgress(`${loadPages} pages loaded. Select page range and extract.`);
    } catch (err) {
      toast({ title: 'PDF Error', description: 'Could not read the PDF file.', variant: 'destructive' });
      setProgress('');
    }
  }, [toast]);

  const lowTextPages = pages.filter(p => p.charCount < LOW_TEXT_THRESHOLD);
  const emptyPages = pages.filter(p => p.charCount === 0);
  const hasLowTextWarning = lowTextPages.length > pages.length * 0.5 && pages.length > 0;

  const handleExtract = async () => {
    if (pages.length === 0) return;
    const sp = parseInt(startPage) || 1;
    const ep = parseInt(endPage) || pages.length;

    if (ep - sp + 1 > 50) {
      toast({ title: 'Range too large', description: 'Select max 50 pages per extraction. You can extract more in the next run.', variant: 'destructive' });
      return;
    }

    setExtracting(true);
    const previousCount = questions.length;

    const selectedPages = pages.filter(p => p.pageNum >= sp && p.pageNum <= ep);
    const totalBatches = Math.ceil(selectedPages.length / BATCH_SIZE);

    try {
      let newQuestions: ExtractedQuestion[] = [];

      for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
        const batchPages = selectedPages.slice(batchIdx * BATCH_SIZE, (batchIdx + 1) * BATCH_SIZE);
        const batchText = batchPages.map(p => `\n--- Page ${p.pageNum} ---\n${p.text}`).join('\n');

        if (batchText.trim().length < 30) {
          setProgress(`Batch ${batchIdx + 1}/${totalBatches} — skipped (no text)`);
          continue;
        }

        const fromPage = batchPages[0].pageNum;
        const toPage = batchPages[batchPages.length - 1].pageNum;
        setProgress(`Processing pages ${fromPage}–${toPage} (batch ${batchIdx + 1}/${totalBatches})... ${previousCount + newQuestions.length} questions total`);
        setProgressPercent(Math.round(((batchIdx + 1) / totalBatches) * 100));
        setQuestionsFoundSoFar(previousCount + newQuestions.length);

        const { data, error } = await supabase.functions.invoke('pyq-extract', {
          body: { pageText: batchText, year: parseInt(year), exam: 'RBI Grade B', topics: [...RBI_ALL_TOPICS] },
        });

        if (error) {
          if ((error as any)?.status === 429) {
            toast({ title: 'Rate limited', description: 'Waiting and retrying...', variant: 'destructive' });
            await new Promise(r => setTimeout(r, 3000));
            batchIdx--;
            continue;
          }
          if ((error as any)?.status === 402) {
            toast({ title: 'Credits exhausted', description: 'Please add credits to continue.', variant: 'destructive' });
            break;
          }
          throw error;
        }

        if (data?.questions) {
          newQuestions = [...newQuestions, ...data.questions];
          setQuestionsFoundSoFar(previousCount + newQuestions.length);
        }

        if (batchIdx < totalBatches - 1) {
          await new Promise(r => setTimeout(r, DELAY_MS));
        }
      }

      // Append to existing questions
      setQuestions(prev => [...prev, ...newQuestions]);
      setLastExtractedRange(`${sp}–${ep}`);

      // Auto-suggest next range
      const nextStart = ep + 1;
      if (nextStart <= pages.length) {
        setStartPage(nextStart.toString());
        setEndPage(Math.min(nextStart + 49, pages.length).toString());
      }

      if (newQuestions.length > 0 || questions.length > 0) {
        setStep('review');
      }

      setProgress(`Extracted ${newQuestions.length} new questions from pages ${sp}–${ep}. Total: ${previousCount + newQuestions.length}`);
      setProgressPercent(100);
      toast({ title: 'Extraction complete', description: `Found ${newQuestions.length} new questions (${previousCount + newQuestions.length} total).` });
    } catch (err: any) {
      toast({ title: 'Extraction failed', description: err.message || 'AI could not extract questions.', variant: 'destructive' });
      setProgress('Extraction failed.');
    } finally {
      setExtracting(false);
    }
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateQuestionTopic = (idx: number, topic: RbiTopic) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, topic } : q));
  };

  const clearAllQuestions = () => {
    setQuestions([]);
    setQuestionsFoundSoFar(0);
    setLastExtractedRange('');
    toast({ title: 'Cleared', description: 'All extracted questions removed.' });
  };

  const handleSaveAll = async () => {
    if (!user || questions.length === 0) return;
    setSaving(true);

    try {
      const rows = questions.map(q => ({
        user_id: user.id,
        question_text: q.question_text,
        options: q.options,
        correct_option: q.correct_option,
        topic: q.topic as any,
        difficulty: q.difficulty as any,
        explanation: q.explanation,
        is_pyq: true,
        exam: 'RBI' as any,
        year: parseInt(year),
      }));

      for (let i = 0; i < rows.length; i += 20) {
        const batch = rows.slice(i, i + 20);
        const { error } = await supabase.from('ssc_questions').insert(batch);
        if (error) throw error;
      }

      toast({ title: 'Saved!', description: `${questions.length} PYQ questions saved to database.` });
      navigate('/rbi/pyq');
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const yearOptions = Array.from({ length: 31 }, (_, i) => (2025 - i).toString());

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/rbi/pyq')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to PYQ
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload RBI Grade B PYQ Paper</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload a PDF and extract questions in batches of up to 50 pages. State is preserved between extractions.</p>
      </div>

      {/* Accumulated questions indicator */}
      {questions.length > 0 && step === 'upload' && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm font-medium text-foreground">
            📦 {questions.length} questions accumulated{lastExtractedRange && ` (last: pages ${lastExtractedRange})`}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAllQuestions} className="gap-1">
              <XCircle className="h-3.5 w-3.5" /> Clear All
            </Button>
            <Button size="sm" onClick={() => setStep('review')} className="gap-1">
              Review & Save
            </Button>
          </div>
        </div>
      )}

      {step === 'upload' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Exam Year</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(y => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">PDF File</label>
                <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all"
                >
                  {pdfName ? (
                    <div className="flex items-center justify-center gap-2 text-foreground">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{pdfName}</span>
                      <Badge variant="secondary">{pageCount} pages</Badge>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to select a PDF file</p>
                    </div>
                  )}
                </div>
              </div>

              {pages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-1.5 block">From Page</label>
                      <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="" value={startPage}
                        onChange={e => setStartPage(e.target.value.replace(/[^0-9]/g, ''))} />
                    </div>
                    <span className="mt-6 text-muted-foreground font-medium">—</span>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-1.5 block">To Page</label>
                      <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="" value={endPage}
                        onChange={e => setEndPage(e.target.value.replace(/[^0-9]/g, ''))} />
                    </div>
                    <div className="mt-6">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {(() => {
                          const sp = parseInt(startPage) || 1;
                          const ep = parseInt(endPage) || pages.length;
                          const count = Math.max(0, ep - sp + 1);
                          return `${count} pages${count > 50 ? ' ⚠️ max 50' : ''}`;
                        })()}
                      </Badge>
                    </div>
                  </div>

                  {hasLowTextWarning && (
                    <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">This PDF appears to be scanned/image-based</p>
                        <p className="text-muted-foreground">{emptyPages.length} of {pages.length} pages have no extractable text.</p>
                      </div>
                    </div>
                  )}

                  {lowTextPages.length > 0 && lowTextPages.length <= pages.length * 0.5 && (
                    <p className="text-xs text-muted-foreground">
                      💡 Pages with little text: {lowTextPages.map(p => p.pageNum).join(', ')}
                    </p>
                  )}
                </div>
              )}

              {progress && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    {extracting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {progress}
                  </p>
                  {extracting && (
                    <div className="space-y-1">
                      <Progress value={progressPercent} className="h-2" />
                      {questionsFoundSoFar > 0 && (
                        <p className="text-xs text-primary font-medium">{questionsFoundSoFar} questions total</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <Button onClick={handleExtract} disabled={pages.length === 0 || extracting} className="w-full gap-2">
                {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {extracting ? `Extracting... (${questionsFoundSoFar} total)` : `Extract Questions (Pages ${startPage || '1'}–${endPage || pages.length})`}
              </Button>
            </CardContent>
          </Card>

          <div className="p-4 rounded-lg bg-accent/50 border border-border">
            <div className="flex gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Tips for best results:</p>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  <li>Upload clear, text-based PDFs (not scanned images)</li>
                  <li>All pages are loaded, extract up to 50 pages per run</li>
                  <li>Questions accumulate — extract pages 1-50, then 51-100</li>
                  <li>Page range auto-advances after each extraction</li>
                  <li>You can review and edit all questions before saving</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Review Extracted Questions</h2>
              <p className="text-sm text-muted-foreground">{questions.length} questions found • Year: {year}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Extract More
              </Button>
              <Button variant="outline" onClick={clearAllQuestions} className="gap-1 text-destructive">
                <XCircle className="h-4 w-4" /> Clear All
              </Button>
              <Button onClick={handleSaveAll} disabled={saving || questions.length === 0} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save All ({questions.length})
              </Button>
            </div>
          </div>

          {questions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No questions extracted. Try re-uploading with a clearer PDF.
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="w-44">Topic</TableHead>
                    <TableHead className="w-24">Difficulty</TableHead>
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{i + 1}</TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground line-clamp-2">{q.question_text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Options: {q.options.map((o, j) => `${String.fromCharCode(65 + j)}) ${o}`).join(' | ')}
                        </p>
                        <p className="text-xs text-primary mt-0.5">Answer: {String.fromCharCode(65 + q.correct_option)}</p>
                      </TableCell>
                      <TableCell>
                        <Select value={q.topic} onValueChange={(v) => updateQuestionTopic(i, v as RbiTopic)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {RBI_ALL_TOPICS.map(t => (
                              <SelectItem key={t} value={t}>
                                {RBI_TOPIC_META[t]?.icon} {RBI_TOPIC_META[t]?.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={q.difficulty === 'easy' ? 'secondary' : q.difficulty === 'hard' ? 'destructive' : 'outline'} className="text-xs">
                          {q.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeQuestion(i)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
