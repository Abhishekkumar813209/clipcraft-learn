import { useEffect, useMemo, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Scissors, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalPages: number;
  fileName: string;
  getBytes: () => Promise<Uint8Array | null>;
}

export function PdfSplitterDialog({ open, onOpenChange, totalPages, fileName, getBytes }: Props) {
  const [startStr, setStartStr] = useState('1');
  const [endStr, setEndStr] = useState('1');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setStartStr('1');
      setEndStr(String(totalPages));
    }
  }, [open, totalPages]);

  const start = parseInt(startStr, 10);
  const end = parseInt(endStr, 10);
  const valid =
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    start >= 1 &&
    end >= start &&
    end <= totalPages;
  const count = valid ? end - start + 1 : 0;

  const baseName = useMemo(() => (fileName || 'document').replace(/\.pdf$/i, ''), [fileName]);

  const setPreset = (s: number, e: number) => {
    setStartStr(String(Math.max(1, s)));
    setEndStr(String(Math.min(totalPages, e)));
  };

  const handleDownload = async () => {
    if (!valid) {
      toast.error('Enter a valid page range');
      return;
    }
    setBusy(true);
    try {
      const bytes = await getBytes();
      if (!bytes) throw new Error('PDF data not available');
      const srcDoc = await PDFDocument.load(bytes);
      const newDoc = await PDFDocument.create();
      const indices = Array.from({ length: count }, (_, i) => start - 1 + i);
      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach((p) => newDoc.addPage(p));
      const out = await newDoc.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_p${start}-${end}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`Downloaded ${count} page${count > 1 ? 's' : ''}`);
      onOpenChange(false);
    } catch (e: any) {
      console.error('Split failed', e);
      toast.error(e?.message || 'Failed to split PDF');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="h-4 w-4" /> Split PDF
          </DialogTitle>
          <DialogDescription>
            Total pages: <span className="font-medium text-foreground">{totalPages}</span>. Pick a page range to download as a new PDF — everything happens in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="split-start">Start page</Label>
              <Input
                id="split-start"
                type="text"
                inputMode="numeric"
                value={startStr}
                onChange={(e) => setStartStr(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="split-end">End page</Label>
              <Input
                id="split-end"
                type="text"
                inputMode="numeric"
                value={endStr}
                onChange={(e) => setEndStr(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPreset(1, Math.min(10, totalPages))}>
              First 10
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setPreset(Math.max(1, totalPages - 9), totalPages)}>
              Last 10
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setPreset(1, totalPages)}>
              All
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {valid ? (
              <>Will export <span className="font-medium text-foreground">{count}</span> page{count > 1 ? 's' : ''} ({start}–{end}).</>
            ) : (
              <span className="text-destructive">Invalid range. Use 1 to {totalPages}.</span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
            <Button onClick={handleDownload} disabled={!valid || busy}>
              {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
