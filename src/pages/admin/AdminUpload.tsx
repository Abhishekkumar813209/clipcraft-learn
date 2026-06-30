import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, Save, Trash2, Sparkles, ScanLine, ClipboardPaste } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import PdfPagePicker from '@/components/admin/PdfPagePicker';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

interface Book { id: string; name: string; exam_tag: string; }
interface Topic { id: string; book_id: string; name: string; }
interface Subtopic { id: string; topic_id: string; name: string; }

interface PageData {
  pageNum: number;
  text: string;
  needsOcr: boolean;
  ocrDone: boolean;
}

interface ExtractedQ {
  question_text: string;
  options: string[];
  correct_option: number;
  difficulty: string;
  explanation: string;
}

const BATCH_SIZE = 3;
const OCR_BATCH = 3;
const SCAN_TEXT_THRESHOLD = 40; // chars

async function renderPageToJpeg(pdf: any, pageNum: number, scale = 1.6): Promise<string> {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL('image/jpeg', 0.78);
}

export default function AdminUpload() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);

  const [bookId, setBookId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [subtopicId, setSubtopicId] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [pages, setPages] = useState<PageData[]>([]);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [answerKey, setAnswerKey] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [ocring, setOcring] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [questions, setQuestions] = useState<ExtractedQ[]>([]);

  useEffect(() => {
    (async () => {
      const [b, t, s] = await Promise.all([
        supabase.from('admin_books' as never).select('*').order('name'),
        supabase.from('admin_topics' as never).select('*').order('order_index'),
        supabase.from('admin_subtopics' as never).select('*').order('order_index'),
      ]);
      setBooks((b.data as Book[]) || []);
      setTopics((t.data as Topic[]) || []);
      setSubtopics((s.data as Subtopic[]) || []);
    })();
  }, []);

  const filteredTopics = topics.filter((t) => t.book_id === bookId);
  const filteredSubtopics = subtopics.filter((s) => s.topic_id === topicId);
  const selectedBook = books.find((b) => b.id === bookId);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast({ title: 'Invalid file', description: 'PDF only', variant: 'destructive' });
      return;
    }
    setPdfName(file.name);
    setPages([]);
    setPdfDoc(null);
    setQuestions([]);
    setProgressMsg('Reading PDF...');
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      setPdfDoc(pdf);
      const collected: PageData[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((it: any) => it.str).join(' ');
        const needsOcr = text.trim().length < SCAN_TEXT_THRESHOLD;
        collected.push({ pageNum: i, text, needsOcr, ocrDone: false });
        setProgressMsg(`Reading page ${i}/${pdf.numPages}`);
      }
      setPages(collected);
      setStartPage(1);
      setEndPage(collected.length);
      const scanned = collected.filter((p) => p.needsOcr).length;
      setProgressMsg(
        scanned > 0
          ? `Loaded ${collected.length} pages · ${scanned} look scanned (OCR will run)`
          : `Loaded ${collected.length} pages`,
      );
    } catch (err: any) {
      toast({ title: 'PDF error', description: err.message, variant: 'destructive' });
    }
  }, [toast]);

  /** Run OCR on a list of pages (mutates state in place). Returns updated page array. */
  async function runOcrOnPages(targetPages: PageData[]): Promise<PageData[]> {
    if (!pdfDoc || !targetPages.length) return pages;
    const updated = [...pages];
    for (let i = 0; i < targetPages.length; i += OCR_BATCH) {
      const batch = targetPages.slice(i, i + OCR_BATCH);
      setProgressMsg(
        `OCR pages ${batch[0].pageNum}-${batch[batch.length - 1].pageNum}...`,
      );
      // Render to JPEGs (client-side)
      const payload: { pageNum: number; imageBase64: string }[] = [];
      for (const p of batch) {
        try {
          const url = await renderPageToJpeg(pdfDoc, p.pageNum, 1.6);
          payload.push({ pageNum: p.pageNum, imageBase64: url });
        } catch (e) {
          console.warn('render fail page', p.pageNum, e);
        }
      }
      if (!payload.length) continue;
      const { data, error } = await supabase.functions.invoke('admin-ocr-pages', {
        body: { pages: payload },
      });
      if (error) {
        console.error('OCR error', error);
        toast({ title: 'OCR failed', description: error.message, variant: 'destructive' });
        continue;
      }
      const results: { pageNum: number; text: string }[] = data?.results || [];
      for (const r of results) {
        const idx = updated.findIndex((p) => p.pageNum === r.pageNum);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], text: r.text || updated[idx].text, ocrDone: true };
        }
      }
      setPages([...updated]);
      await new Promise((r) => setTimeout(r, 400));
    }
    return updated;
  }

  async function runOcrOnly() {
    if (!pdfDoc) return;
    const s = Math.max(1, startPage);
    const e = Math.min(pages.length, endPage);
    const targets = pages
      .slice(s - 1, e)
      .filter((p) => p.needsOcr && !p.ocrDone);
    if (!targets.length) {
      toast({ title: 'Nothing to OCR', description: 'All selected pages already have text.' });
      return;
    }
    setOcring(true);
    try {
      await runOcrOnPages(targets);
      toast({ title: 'OCR complete', description: `${targets.length} pages transcribed` });
    } finally {
      setOcring(false);
    }
  }

  async function extract() {
    if (!bookId || !topicId) {
      toast({ title: 'Pick book & topic first', variant: 'destructive' });
      return;
    }
    if (!pages.length) {
      toast({ title: 'Upload a PDF first', variant: 'destructive' });
      return;
    }
    const s = Math.max(1, startPage);
    const e = Math.min(pages.length, endPage);

    setExtracting(true);
    setQuestions([]);

    // 1. OCR pass for any pages in range that still need it
    let working = pages;
    const ocrTargets = pages.slice(s - 1, e).filter((p) => p.needsOcr && !p.ocrDone);
    if (ocrTargets.length) {
      working = await runOcrOnPages(ocrTargets);
    }

    const slice = working.slice(s - 1, e);
    const all: ExtractedQ[] = [];
    const bookName = selectedBook?.name;
    const topicName = topics.find((t) => t.id === topicId)?.name;
    const subtopicName = subtopics.find((sub) => sub.id === subtopicId)?.name;

    try {
      for (let i = 0; i < slice.length; i += BATCH_SIZE) {
        const batch = slice.slice(i, i + BATCH_SIZE);
        const pageText = batch.map((p) => `--- Page ${p.pageNum} ---\n${p.text}`).join('\n\n');
        setProgressMsg(`Extracting pages ${batch[0].pageNum}-${batch[batch.length - 1].pageNum}...`);
        setProgress(Math.round((i / slice.length) * 100));

        const { data, error } = await supabase.functions.invoke('admin-question-extract', {
          body: {
            pageText,
            examTag: selectedBook?.exam_tag,
            bookName,
            topicName,
            subtopicName,
            answerKeyText: answerKey || undefined,
          },
        });
        if (error) throw error;
        if (data?.questions) all.push(...data.questions);
        setQuestions([...all]);
        await new Promise((r) => setTimeout(r, 800));
      }
      setProgress(100);
      setProgressMsg(`Done — ${all.length} questions extracted`);
      toast({ title: 'Extracted', description: `${all.length} questions found` });
    } catch (err: any) {
      toast({ title: 'Extract failed', description: err.message, variant: 'destructive' });
    } finally {
      setExtracting(false);
    }
  }

  async function saveAll() {
    if (!questions.length) return;
    setSaving(true);
    try {
      const rows = questions.map((q) => ({
        book_id: bookId,
        topic_id: topicId,
        subtopic_id: subtopicId || null,
        exam_tag: selectedBook?.exam_tag || 'Other',
        question_text: q.question_text,
        options: q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty: q.difficulty || 'medium',
        source_pdf_name: pdfName || null,
      }));
      const { error } = await supabase.from('admin_questions' as never).insert(rows as never);
      if (error) throw error;
      toast({ title: 'Saved', description: `${rows.length} questions saved to database` });
      setQuestions([]);
      setPages([]);
      setPdfDoc(null);
      setPdfName('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  function updateQ(i: number, patch: Partial<ExtractedQ>) {
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }
  function delQ(i: number) {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  }

  const scannedInRange = pages
    .slice(Math.max(0, startPage - 1), Math.min(pages.length, endPage))
    .filter((p) => p.needsOcr && !p.ocrDone).length;
  const scannedPages = new Set(pages.filter((p) => p.needsOcr).map((p) => p.pageNum));
  const ocrDonePages = new Set(pages.filter((p) => p.ocrDone).map((p) => p.pageNum));

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <h1 className="text-2xl font-semibold">Upload Questions PDF</h1>

      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Book</label>
            <Select value={bookId} onValueChange={(v) => { setBookId(v); setTopicId(''); setSubtopicId(''); }}>
              <SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger>
              <SelectContent>
                {books.map((b) => <SelectItem key={b.id} value={b.id}>{b.name} · {b.exam_tag}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Topic</label>
            <Select value={topicId} onValueChange={(v) => { setTopicId(v); setSubtopicId(''); }} disabled={!bookId}>
              <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
              <SelectContent>
                {filteredTopics.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Subtopic (optional)</label>
            <Select value={subtopicId} onValueChange={setSubtopicId} disabled={!topicId}>
              <SelectTrigger><SelectValue placeholder="Select subtopic" /></SelectTrigger>
              <SelectContent>
                {filteredSubtopics.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept="application/pdf" onChange={handleFile} className="hidden" id="pdf-upload" />
            <label htmlFor="pdf-upload">
              <Button asChild variant="outline"><span><Upload className="w-4 h-4 mr-1" />Choose PDF</span></Button>
            </label>
            {pdfName && <span className="text-sm">{pdfName} · {pages.length} pages</span>}
          </div>

          {scannedInRange > 0 && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <ScanLine className="w-4 h-4" />
                {scannedInRange} scanned page{scannedInRange > 1 ? 's' : ''} in selected range — OCR will run automatically before extraction.
              </div>
              <Button size="sm" variant="outline" onClick={runOcrOnly} disabled={ocring || extracting}>
                {ocring ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <ScanLine className="w-3 h-3 mr-1" />}
                Run OCR now
              </Button>
            </div>
          )}

          {pages.length > 0 && (
            <PdfPagePicker
              pdfDoc={pdfDoc}
              pageCount={pages.length}
              startPage={startPage}
              endPage={endPage}
              onChange={(s, e) => { setStartPage(s); setEndPage(e); }}
              scannedPages={scannedPages}
              ocrDonePages={ocrDonePages}
            />
          )}
          <div>
            <label className="text-xs text-muted-foreground">Answer key (optional, paste text)</label>
            <Textarea rows={3} value={answerKey} onChange={(e) => setAnswerKey(e.target.value)} placeholder="1-C, 2-A, 3-B ..." />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={extract} disabled={extracting || ocring || !pages.length}>
              {extracting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
              Extract Questions
            </Button>
            <span className="text-xs text-muted-foreground">{progressMsg}</span>
          </div>
          {(extracting || ocring) && <Progress value={progress} />}
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Review ({questions.length})</h2>
              <Button onClick={saveAll} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                Save All
              </Button>
            </div>
            {questions.map((q, i) => (
              <div key={i} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between gap-2">
                  <Textarea
                    value={q.question_text}
                    onChange={(e) => updateQ(i, { question_text: e.target.value })}
                    rows={2}
                  />
                  <Button variant="ghost" size="icon" onClick={() => delQ(i)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${i}`}
                        checked={q.correct_option === j}
                        onChange={() => updateQ(i, { correct_option: j })}
                      />
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const n = [...q.options];
                          n[j] = e.target.value;
                          updateQ(i, { options: n });
                        }}
                      />
                    </div>
                  ))}
                </div>
                <Textarea
                  value={q.explanation}
                  onChange={(e) => updateQ(i, { explanation: e.target.value })}
                  rows={2}
                  placeholder="Explanation"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
