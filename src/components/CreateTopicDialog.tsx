import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStudyStore } from '@/stores/studyStore';

interface CreateTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: string;
}

export function CreateTopicDialog({ open, onOpenChange, subjectId }: CreateTopicDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { addTopic } = useStudyStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addTopic({ name: name.trim(), description: description.trim(), subjectId });
    
    setName('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Topic</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Topic Name</Label>
            <Input
              id="name"
              placeholder="e.g., Modern History, Thermodynamics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this topic..."
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
              Add Topic
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
