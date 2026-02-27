import { useState } from 'react';
import { ArrowLeft, Plus, Star, Sparkles, Play, Trash2, GripVertical, MoreVertical } from 'lucide-react';
import { useStudyStore } from '@/stores/studyStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDuration } from '@/types';
import { cn } from '@/lib/utils';

interface TopicViewProps {
  onBack: () => void;
}

export function TopicView({ onBack }: TopicViewProps) {
  const [showAddSubTopic, setShowAddSubTopic] = useState(false);
  const {
    exams,
    selectedSubjectId,
    selectedTopicId,
    clips,
    videos,
    getSubTopicsByTopic,
    deleteSubTopic,
    deleteClip,
    updateClip,
  } = useStudyStore();

  // Find the topic
  let topic = null;
  let subject = null;
  let exam = null;

  for (const e of exams) {
    for (const s of e.subjects || []) {
      if (s.id === selectedSubjectId) {
        subject = s;
        exam = e;
        for (const t of s.topics || []) {
          if (t.id === selectedTopicId) {
            topic = t;
            break;
          }
        }
      }
    }
  }

  const subTopics = selectedTopicId ? getSubTopicsByTopic(selectedTopicId) : [];

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Topic not found</p>
      </div>
    );
  }

  // Calculate total duration
  const totalDuration = clips
    .filter((c) => subTopics.some((st) => st.id === c.subTopicId))
    .reduce((acc, c) => acc + (c.endTime - c.startTime), 0);

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex-shrink-0 animate-fade-in">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {exam?.icon} {exam?.name} / {subject?.name}
              </p>
              <h1 className="font-display text-2xl font-bold">{topic.name}</h1>
              {topic.description && (
                <p className="text-muted-foreground mt-1">{topic.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Duration</p>
              <p className="font-display text-2xl font-bold text-primary">
                {formatDuration(totalDuration)}
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Topics */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                Sub-Topics ({subTopics.length})
              </h2>
              <Button size="sm" onClick={() => setShowAddSubTopic(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Sub-Topic
              </Button>
            </div>

            {subTopics.length === 0 ? (
              <div className="clip-card text-center py-12">
                <h3 className="font-display text-lg font-semibold mb-2">
                  No sub-topics yet
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Break this topic into concept-level sub-topics to organize your clips.
                </p>
                <Button onClick={() => setShowAddSubTopic(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Sub-Topic
                </Button>
              </div>
            ) : (
              subTopics.map((subTopic, index) => (
                <SubTopicSection
                  key={subTopic.id}
                  subTopic={subTopic}
                  index={index}
                  clips={clips.filter((c) => c.subTopicId === subTopic.id).sort((a, b) => a.order - b.order)}
                  videos={videos}
                  onDeleteSubTopic={() => deleteSubTopic(subTopic.id)}
                  onDeleteClip={deleteClip}
                  onToggleClipType={(clipId, isPrimary) => updateClip(clipId, { isPrimary })}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <AddSubTopicDialog
        open={showAddSubTopic}
        onOpenChange={setShowAddSubTopic}
        topicId={selectedTopicId!}
      />
    </>
  );
}

interface SubTopicSectionProps {
  subTopic: any;
  index: number;
  clips: any[];
  videos: any[];
  onDeleteSubTopic: () => void;
  onDeleteClip: (id: string) => void;
  onToggleClipType: (id: string, isPrimary: boolean) => void;
}

function SubTopicSection({
  subTopic,
  index,
  clips,
  videos,
  onDeleteSubTopic,
  onDeleteClip,
  onToggleClipType,
}: SubTopicSectionProps) {
  const duration = clips.reduce((acc, c) => acc + (c.endTime - c.startTime), 0);
  const primaryCount = clips.filter((c) => c.isPrimary).length;

  return (
    <div 
      className="clip-card animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
            {index + 1}
          </div>
          <div>
            <h3 className="font-display font-semibold">{subTopic.name}</h3>
            <p className="text-sm text-muted-foreground">
              {clips.length} clips • {formatDuration(duration)}
              {primaryCount > 0 && ` • ${primaryCount} primary`}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem
              className="text-destructive"
              onClick={onDeleteSubTopic}
            >
              Delete Sub-Topic
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {clips.length > 0 && (
        <div className="space-y-2">
          {clips.map((clip) => {
            const video = videos.find((v) => v.id === clip.videoId);
            return (
              <div
                key={clip.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg bg-secondary/50 group transition-all",
                  clip.isPrimary ? "border-l-4 border-l-clip-primary" : "border-l-4 border-l-clip-supplementary"
                )}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
                
                <div className="w-20 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                  {video?.youtubeId && (
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {clip.isPrimary ? (
                      <Star className="w-3.5 h-3.5 text-clip-primary fill-clip-primary flex-shrink-0" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-clip-supplementary flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium truncate">
                      {clip.label || video?.title || 'Untitled'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(clip.startTime)} → {formatDuration(clip.endTime)}
                    <span className="mx-2">•</span>
                    {formatDuration(clip.endTime - clip.startTime)}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onToggleClipType(clip.id, !clip.isPrimary)}
                  >
                    {clip.isPrimary ? (
                      <Sparkles className="w-4 h-4 text-clip-supplementary" />
                    ) : (
                      <Star className="w-4 h-4 text-clip-primary" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      if (video?.youtubeId) {
                        window.open(
                          `https://youtube.com/watch?v=${video.youtubeId}&t=${clip.startTime}`,
                          '_blank'
                        );
                      }
                    }}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDeleteClip(clip.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface AddSubTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
}

function AddSubTopicDialog({ open, onOpenChange, topicId }: AddSubTopicDialogProps) {
  const [name, setName] = useState('');
  const { addSubTopic } = useStudyStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addSubTopic({ name: name.trim(), topicId });
    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add Sub-Topic</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Sub-Topic Name</Label>
            <Input
              id="name"
              placeholder="e.g., Causes of French Revolution"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary border-border"
            />
            <p className="text-xs text-muted-foreground">
              Sub-topics represent specific concepts. Clips will be organized under these.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add Sub-Topic
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
