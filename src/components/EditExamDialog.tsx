import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStudyStore } from '@/stores/studyStore';
import { Exam } from '@/types';

const EXAM_ICONS = ['📚', '🎓', '📖', '🏛️', '⚖️', '🔬', '💊', '🧮', '🌍', '💻'];

interface EditExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam;
}

export function EditExamDialog({ open, onOpenChange, exam }: EditExamDialogProps) {
  const [name, setName] = useState(exam.name);
  const [description, setDescription] = useState(exam.description || '');
  const [icon, setIcon] = useState(exam.icon || '📚');
  const { updateExam } = useStudyStore();

  useEffect(() => {
    setName(exam.name);
    setDescription(exam.description || '');
    setIcon(exam.icon || '📚');
  }, [exam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await updateExam(exam.id, { name: name.trim(), description: description.trim(), icon });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Edit Exam</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {EXAM_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    icon === emoji
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-muted/20 hover:bg-muted/30'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Exam Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g., UPSC Civil Services"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea
              id="edit-description"
              placeholder="Add notes about this exam..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-input resize-none"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
