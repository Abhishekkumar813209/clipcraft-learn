import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Upload, FileText, Loader2, Trash2, Save, Sparkles, XCircle, ArrowRightLeft } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface WordEntry {
  word: string;
  meaning: string;
}

interface VocabEntry {
  root: string | null;
  root_meaning: string | null;
  words: WordEntry[];
}

interface PageInfo {
  pageNum: number;
  text: string;
  charCount: number;
}

const BATCH_SIZE = 2;
const DELAY_MS = 2000;
const MAX_PAGES = 500;

export default function SscVocabUpload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [sourceBook, setSourceBook] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [entries, setEntries] = useState<VocabEntry[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [pageCount, setPageCount] = useState(0);
  const [progress, setProgress] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [lastExtractedRange, setLastExtractedRange] = useState('');

  const totalWords = entries.reduce((sum, e) => sum + e.words.length, 0);

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
    setEntries([]);
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
      setEndPage(Math.min(25, loadPages).toString());
      setProgress(`${loadPages} pages loaded. Select page range and extract.`);
    } catch {
      toast({ title: 'PDF Error', description: 'Could not read the PDF file.', variant: 'destructive' });
      setProgress('');
    }
  }, [toast]);

  const handleExtract = async () => {
    if (pages.length === 0) return;
    const sp = parseInt(startPage) || 1;
    const ep = parseInt(endPage) || pages.length;

    if (ep - sp + 1 > 50) {
      toast({ title: 'Range too large', description: 'Select max 50 pages per extraction.', variant: 'destructive' });
      return;
    }

    setExtracting(true);

    const selectedPages = pages.filter(p => p.pageNum >= sp && p.pageNum <= ep);
    const totalBatches = Math.ceil(selectedPages.length / BATCH_SIZE);

    try {
      let newEntries: VocabEntry[] = [];

      for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
        const batchPages = selectedPages.slice(batchIdx * BATCH_SIZE, (batchIdx + 1) * BATCH_SIZE);
        const batchText = batchPages.map(p => `\n--- Page ${p.pageNum} ---\n${p.text}`).join('\n');

        if (batchText.trim().length < 30) {
          setProgress(`Batch ${batchIdx + 1}/${totalBatches} — skipped (no text)`);
          continue;
        }

        const fromPage = batchPages[0].pageNum;
        const toPage = batchPages[batchPages.length - 1].pageNum;
        setProgress(`Processing pages ${fromPage}–${toPage} (batch ${batchIdx + 1}/${totalBatches})...`);
        setProgressPercent(Math.round(((batchIdx + 1) / totalBatches) * 100));

        const { data, error } = await supabase.functions.invoke('ssc-vocab-extract', {
          body: { pageText: batchText },
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

        if (data?.entries) {
          newEntries = [...newEntries, ...data.entries];
        }

        if (batchIdx < totalBatches - 1) {
          await new Promise(r => setTimeout(r, DELAY_MS));
        }
      }

      // Smart merge by root name (not flat dedup)
      setEntries(prev => {
        const all = [...prev, ...newEntries];
        const rootMap = new Map<string, VocabEntry>();
        
        for (const entry of all) {
          const key = (entry.root || '__no_root__').toLowerCase().trim();
          const existing = rootMap.get(key);
          if (existing) {
            const mergedWords = [...new Set([...existing.words, ...entry.words].map(w => w.toLowerCase()))].sort();
            rootMap.set(key, {
              root: existing.root || entry.root,
              root_meaning: existing.root_meaning || entry.root_meaning,
              words: mergedWords,
            });
          } else {
            rootMap.set(key, { ...entry, words: [...new Set(entry.words.map(w => w.toLowerCase()))].sort() });
          }
        }
        
        return Array.from(rootMap.values()).filter(e => e.words.length > 0);
      });

      setLastExtractedRange(`${sp}–${ep}`);

      const nextStart = ep + 1;
      if (nextStart <= pages.length) {
        setStartPage(nextStart.toString());
        setEndPage(Math.min(nextStart + 24, pages.length).toString());
      }

      if (newEntries.length > 0 || entries.length > 0) {
        setStep('review');
      }

      const newWordCount = newEntries.reduce((s, e) => s + e.words.length, 0);
      setProgress(`Extracted ${newWordCount} new words from pages ${sp}–${ep}.`);
      setProgressPercent(100);
      toast({ title: 'Extraction complete', description: `Found ${newWordCount} new words.` });
    } catch (err: any) {
      toast({ title: 'Extraction failed', description: err.message || 'AI could not extract vocabulary.', variant: 'destructive' });
      setProgress('Extraction failed.');
    } finally {
      setExtracting(false);
    }
  };

  const removeEntry = (idx: number) => {
    setEntries(prev => prev.filter((_, i) => i !== idx));
  };

  const removeWord = (entryIdx: number, wordIdx: number) => {
    setEntries(prev => prev.map((e, i) => {
      if (i !== entryIdx) return e;
      const newWords = e.words.filter((_, wi) => wi !== wordIdx);
      return { ...e, words: newWords };
    }).filter(e => e.words.length > 0));
  };

  const clearAll = () => {
    setEntries([]);
    setLastExtractedRange('');
    toast({ title: 'Cleared', description: 'All extracted words removed.' });
  };

  const moveWord = (fromIdx: number, wordIdx: number, toIdx: number) => {
    setEntries(prev => {
      const word = prev[fromIdx].words[wordIdx];
      return prev.map((e, i) => {
        if (i === fromIdx) return { ...e, words: e.words.filter((_, wi) => wi !== wordIdx) };
        if (i === toIdx) return { ...e, words: [...new Set([...e.words, word])].sort() };
        return e;
      }).filter(e => e.words.length > 0);
    });
    toast({ title: 'Moved', description: `Word moved to root "${entries[toIdx]?.root || '—'}"` });
  };

  const handleSaveAll = async () => {
    if (!user || totalWords === 0) return;
    setSaving(true);

    try {
      const rows = entries.flatMap(entry =>
        entry.words.map(word => ({
          user_id: user.id,
          root: entry.root || null,
          root_meaning: entry.root_meaning || null,
          word: word.toLowerCase(),
          source_book: sourceBook || null,
        }))
      );

      // Insert in batches of 50, using upsert to skip duplicates
      for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50);
        const { error } = await supabase.from('ssc_vocabulary' as any).upsert(batch as any, { onConflict: 'user_id,word', ignoreDuplicates: true });
        if (error) throw error;
        setProgress(`Saving... ${Math.min(i + 50, rows.length)}/${rows.length}`);
      }

      toast({ title: 'Saved!', description: `${rows.length} vocabulary words saved.` });
      navigate('/ssc/vocab');
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/ssc/vocab')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Vocabulary
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Vocabulary Book</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload a PDF vocabulary book and extract words with roots using AI. Process in batches of up to 50 pages.</p>
      </div>

      {entries.length > 0 && step === 'upload' && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm font-medium text-foreground">
            📦 {totalWords} words accumulated{lastExtractedRange && ` (last: pages ${lastExtractedRange})`}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAll} className="gap-1">
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
                <label className="text-sm font-medium text-foreground mb-1.5 block">Source Book (optional)</label>
                <Input
                  placeholder="e.g. Neetu Singh Vol 1"
                  value={sourceBook}
                  onChange={e => setSourceBook(e.target.value)}
                  className="w-64"
                />
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
                      <p className="text-sm text-muted-foreground">Click to select a PDF vocabulary book</p>
                    </div>
                  )}
                </div>
              </div>

              {pages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-1.5 block">From Page</label>
                      <Input type="text" inputMode="numeric" pattern="[0-9]*" value={startPage}
                        onChange={e => setStartPage(e.target.value.replace(/[^0-9]/g, ''))} />
                    </div>
                    <span className="mt-6 text-muted-foreground font-medium">—</span>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-1.5 block">To Page</label>
                      <Input type="text" inputMode="numeric" pattern="[0-9]*" value={endPage}
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

                  <Button onClick={handleExtract} disabled={extracting} className="gap-2 w-full">
                    {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {extracting ? 'Extracting...' : 'Extract Vocabulary'}
                  </Button>
                </div>
              )}

              {progress && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{progress}</p>
                  {extracting && <Progress value={progressPercent} className="h-2" />}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setStep('upload')} className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Upload
              </Button>
              <Badge variant="secondary" className="text-sm">{totalWords} words from {entries.length} roots</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearAll} className="gap-1">
                <XCircle className="h-3.5 w-3.5" /> Clear All
              </Button>
              <Button onClick={handleSaveAll} disabled={saving || totalWords === 0} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : `Save ${totalWords} Words`}
              </Button>
            </div>
          </div>

          {progress && saving && (
            <p className="text-sm text-muted-foreground">{progress}</p>
          )}

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="w-36">Root</TableHead>
                  <TableHead className="w-44">Root Meaning</TableHead>
                  <TableHead>Word</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  let wordNum = 0;
                  return entries.map((entry, entryIdx) => (
                    entry.words.map((word, wordIdx) => {
                      wordNum++;
                      const isFirstOfRoot = wordIdx === 0;
                      return (
                        <TableRow key={`${entryIdx}-${wordIdx}`} className={isFirstOfRoot && entryIdx > 0 ? 'border-t-2 border-primary/20' : ''}>
                          <TableCell className="text-muted-foreground text-xs">{wordNum}</TableCell>
                          <TableCell className={`font-mono font-bold ${isFirstOfRoot ? 'text-primary' : 'text-primary/40'}`}>
                            {isFirstOfRoot ? (entry.root || '—') : ''}
                          </TableCell>
                          <TableCell className={`text-sm ${isFirstOfRoot ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                            {isFirstOfRoot ? (entry.root_meaning || '—') : ''}
                          </TableCell>
                          <TableCell className="font-medium">{word}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="text-muted-foreground hover:text-primary transition-colors" title="Move to another root">
                                    <ArrowRightLeft className="h-3.5 w-3.5" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2" align="start">
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground px-1 pb-1">Move to root:</p>
                                    {entries.map((target, ti) => ti !== entryIdx && (
                                      <button
                                        key={ti}
                                        onClick={() => moveWord(entryIdx, wordIdx, ti)}
                                        className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-accent transition-colors"
                                      >
                                        {target.root || '(no root)'}
                                        {target.root_meaning && <span className="text-muted-foreground ml-1">({target.root_meaning})</span>}
                                      </button>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <button onClick={() => removeWord(entryIdx, wordIdx)} className="text-muted-foreground hover:text-destructive transition-colors" title="Remove word">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ));
                })()}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
