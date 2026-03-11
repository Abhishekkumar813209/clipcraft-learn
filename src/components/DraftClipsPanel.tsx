import { useState, useEffect, useRef } from 'react';
import { Play, Trash2, ChevronDown, ChevronUp, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickCreateSelect } from '@/components/QuickCreateSelect';
import { useStudyStore } from '@/stores/studyStore';
import { formatDuration } from '@/types';
import { toast } from 'sonner';

export interface DraftClip {
  id: string;
  startTime: number;
  endTime: number;
  label: string;
}

interface DraftClipsPanelProps {
  draftClips: DraftClip[];
  onUpdateLabel: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onSave: (id: string, subTopicId: string, isPrimary: boolean) => void;
  onPlay: (startTime: number) => void;
  newestDraftId: string | null;
}

export function DraftClipsPanel({ draftClips, onUpdateLabel, onDelete, onSave, onPlay, newestDraftId }: DraftClipsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const newestLabelRef = useRef<HTMLInputElement>(null);

  const {
    exams,
    addTopic,
    addSubTopic,
    getSubjectsByExam,
    getTopicsBySubject,
    getSubTopicsByTopic,
  } = useStudyStore();

  // Auto-focus newest draft's label input
  useEffect(() => {
    if (newestDraftId && newestLabelRef.current) {
      newestLabelRef.current.focus();
    }
  }, [newestDraftId]);

  return (
    <div className="clip-card space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-emerald-500" />
        <h3 className="font-display font-semibold text-sm">Draft Clips ({draftClips.length})</h3>
      </div>
      {draftClips.length === 0 ? (
        <p className="text-muted-foreground text-xs text-center py-3">
          Press <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">C</kbd> to set start, <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">D</kbd> to set end
        </p>
      ) : (
        <div className="space-y-2">
          {draftClips.map(draft => (
            <DraftClipItem
              key={draft.id}
              draft={draft}
              isExpanded={expandedId === draft.id}
              isNewest={draft.id === newestDraftId}
              newestLabelRef={newestLabelRef}
              onToggleExpand={() => setExpandedId(expandedId === draft.id ? null : draft.id)}
              onUpdateLabel={onUpdateLabel}
              onDelete={onDelete}
              onSave={onSave}
              onPlay={onPlay}
              exams={exams}
              addTopic={addTopic}
              addSubTopic={addSubTopic}
              getSubjectsByExam={getSubjectsByExam}
              getTopicsBySubject={getTopicsBySubject}
              getSubTopicsByTopic={getSubTopicsByTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DraftClipItemProps {
  draft: DraftClip;
  isExpanded: boolean;
  isNewest: boolean;
  newestLabelRef: React.RefObject<HTMLInputElement>;
  onToggleExpand: () => void;
  onUpdateLabel: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onSave: (id: string, subTopicId: string, isPrimary: boolean) => void;
  onPlay: (startTime: number) => void;
  exams: any[];
  addTopic: any;
  addSubTopic: any;
  getSubjectsByExam: any;
  getTopicsBySubject: any;
  getSubTopicsByTopic: any;
}

function DraftClipItem({
  draft, isExpanded, isNewest, newestLabelRef, onToggleExpand,
  onUpdateLabel, onDelete, onSave, onPlay,
  exams, addTopic, addSubTopic, getSubjectsByExam, getTopicsBySubject, getSubTopicsByTopic,
}: DraftClipItemProps) {
  const [examId, setExamId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [subTopicId, setSubTopicId] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);

  const subjects = examId ? getSubjectsByExam(examId) : [];
  const topics = subjectId ? getTopicsBySubject(subjectId) : [];
  const subTopics = topicId ? getSubTopicsByTopic(topicId) : [];

  useEffect(() => { setSubjectId(''); setTopicId(''); setSubTopicId(''); }, [examId]);
  useEffect(() => { setTopicId(''); setSubTopicId(''); }, [subjectId]);
  useEffect(() => { setSubTopicId(''); }, [topicId]);

  const handleSave = () => {
    if (!subTopicId) { toast.error('Please select a sub-topic'); return; }
    onSave(draft.id, subTopicId, isPrimary);
  };

  return (
    <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 text-sm">
      <div className="flex items-center gap-2 p-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
            {formatDuration(draft.startTime)} → {formatDuration(draft.endTime)}
          </p>
          <Input
            ref={isNewest ? newestLabelRef : undefined}
            value={draft.label}
            onChange={(e) => onUpdateLabel(draft.id, e.target.value)}
            placeholder="Type label..."
            className="h-6 text-xs bg-transparent border-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onPlay(draft.startTime)}>
          <Play className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-emerald-600" onClick={onToggleExpand}>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(draft.id)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {isExpanded && (
        <div className="px-2 pb-2 space-y-2 border-t border-emerald-500/20 pt-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground">Exam</Label>
            <Select value={examId} onValueChange={setExamId}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Select exam" /></SelectTrigger>
              <SelectContent>{exams.map(e => <SelectItem key={e.id} value={e.id}>{e.icon} {e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground">Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId} disabled={!examId}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground">Topic</Label>
            <QuickCreateSelect value={topicId} onValueChange={setTopicId} placeholder="Select topic" disabled={!subjectId} items={topics.map(t => ({ id: t.id, name: t.name }))} createLabel="Topic" onCreate={(name) => addTopic({ name, subjectId })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground">Sub-Topic</Label>
            <QuickCreateSelect value={subTopicId} onValueChange={setSubTopicId} placeholder="Select sub-topic" disabled={!topicId} items={subTopics.map(st => ({ id: st.id, name: st.name }))} createLabel="Sub-Topic" onCreate={(name) => addSubTopic({ name, topicId })} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant={isPrimary ? "default" : "outline"} size="sm" className="h-6 text-[10px]" onClick={() => setIsPrimary(true)}>Primary</Button>
            <Button variant={!isPrimary ? "default" : "outline"} size="sm" className="h-6 text-[10px]" onClick={() => setIsPrimary(false)}>Supplementary</Button>
          </div>
          <Button size="sm" className="w-full h-7 text-xs" onClick={handleSave} disabled={!subTopicId}>
            <Save className="w-3 h-3 mr-1" /> Assign & Save
          </Button>
        </div>
      )}
    </div>
  );
}
