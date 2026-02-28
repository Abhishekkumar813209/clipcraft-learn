import { useState } from 'react';
import { Plus, Video, Clock, Star, Sparkles, Trash2, GripVertical, Play } from 'lucide-react';
import { useStudyStore } from '@/stores/studyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickCreateSelect } from '@/components/QuickCreateSelect';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { extractYouTubeId, formatDuration, parseTimeToSeconds } from '@/types';
import { cn } from '@/lib/utils';

export function AddClipsView() {
  const [showAddClip, setShowAddClip] = useState(false);
  const { exams, clips, videos, getVideoByYouTubeId } = useStudyStore();

  // Get recent clips
  const recentClips = [...clips]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="flex-1 overflow-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold">Add Clips</h1>
          <p className="text-muted-foreground mt-1">
            Create clips from YouTube videos and assign them to concepts
          </p>
        </div>
        <Button onClick={() => setShowAddClip(true)} disabled={exams.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          New Clip
        </Button>
      </div>

      {exams.length === 0 ? (
        <div className="clip-card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">Create an exam first</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Before adding clips, you need to create an exam structure with subjects, topics, and sub-topics.
          </p>
        </div>
      ) : (
        <>
          {/* Quick Add Section */}
          <div className="clip-card mb-8">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Add Workflow
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Daily study made simple: Watch a lecture → Spot a great explanation → Add it as a clip → Continue watching.
            </p>
            <Button onClick={() => setShowAddClip(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Clip
            </Button>
          </div>

          {/* Recent Clips */}
          <div>
            <h2 className="font-display text-lg font-semibold mb-4">Recently Added Clips</h2>
            {recentClips.length === 0 ? (
              <div className="clip-card text-center py-8">
                <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No clips added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentClips.map((clip, index) => {
                  const video = videos.find(v => v.id === clip.videoId);
                  return (
                    <ClipPreviewCard 
                      key={clip.id} 
                      clip={clip} 
                      video={video}
                      index={index}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <AddClipDialog open={showAddClip} onOpenChange={setShowAddClip} />
    </div>
  );
}

function ClipPreviewCard({ clip, video, index }: { clip: any; video: any; index: number }) {
  const { deleteClip } = useStudyStore();
  
  return (
    <div 
      className="clip-card flex items-center gap-4 animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="w-24 h-14 rounded-md bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
        {video?.youtubeId ? (
          <img 
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt={video?.title || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
        ) : (
          <Video className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {clip.isPrimary ? (
            <Star className="w-4 h-4 text-clip-primary fill-clip-primary" />
          ) : (
            <Sparkles className="w-4 h-4 text-clip-supplementary" />
          )}
          <span className="text-sm font-medium truncate">
            {clip.label || video?.title || 'Untitled clip'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDuration(clip.startTime)} → {formatDuration(clip.endTime)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          const url = `https://youtube.com/watch?v=${video?.youtubeId}&t=${clip.startTime}`;
          window.open(url, '_blank');
        }}
      >
        <Play className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={() => deleteClip(clip.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

interface AddClipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddClipDialog({ open, onOpenChange }: AddClipDialogProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedSubTopicId, setSelectedSubTopicId] = useState('');

  const { 
    exams, 
    getSubjectsByExam, 
    getTopicsBySubject, 
    getSubTopicsByTopic,
    addVideo,
    addClip,
    addTopic,
    addSubTopic,
    getVideoByYouTubeId,
  } = useStudyStore();

  const subjects = selectedExamId ? getSubjectsByExam(selectedExamId) : [];
  const topics = selectedSubjectId ? getTopicsBySubject(selectedSubjectId) : [];
  const subTopics = selectedTopicId ? getSubTopicsByTopic(selectedTopicId) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const youtubeId = extractYouTubeId(videoUrl);
    if (!youtubeId || !selectedSubTopicId || !startTime || !endTime) return;

    // Add or get video
    let video = getVideoByYouTubeId(youtubeId);
    let videoId: string;
    
    if (video) {
      videoId = video.id;
    } else {
      videoId = await addVideo({
        youtubeId,
        title: videoTitle || 'Untitled Video',
        duration: 0,
      });
    }

    // Add clip
    await addClip({
      videoId,
      startTime: parseTimeToSeconds(startTime),
      endTime: parseTimeToSeconds(endTime),
      label: label.trim() || undefined,
      notes: notes.trim() || undefined,
      isPrimary,
      subTopicId: selectedSubTopicId,
    });

    // Reset form
    setVideoUrl('');
    setVideoTitle('');
    setStartTime('');
    setEndTime('');
    setLabel('');
    setNotes('');
    setIsPrimary(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Clip</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="videoUrl">YouTube Video URL</Label>
            <Input
              id="videoUrl"
              placeholder="https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="bg-background border-input"
            />
          </div>

          {/* Video Title */}
          <div className="space-y-2">
            <Label htmlFor="videoTitle">Video Title (for display)</Label>
            <Input
              id="videoTitle"
              placeholder="e.g., Modern History Lecture 5 - PW"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="bg-background border-input"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                placeholder="0:00 or 1:30:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                placeholder="5:00 or 1:45:30"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-background border-input"
              />
            </div>
          </div>

          {/* Assignment Dropdowns */}
          <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
            <Label className="text-sm font-semibold">Assign to Concept</Label>
            
            <Select value={selectedExamId} onValueChange={(v) => {
              setSelectedExamId(v);
              setSelectedSubjectId('');
              setSelectedTopicId('');
              setSelectedSubTopicId('');
            }}>
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.icon} {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedExamId && (
              <Select value={selectedSubjectId} onValueChange={(v) => {
                setSelectedSubjectId(v);
                setSelectedTopicId('');
                setSelectedSubTopicId('');
              }}>
                <SelectTrigger className="bg-background border-input">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedSubjectId && (
              <QuickCreateSelect
                value={selectedTopicId}
                onValueChange={(v) => {
                  setSelectedTopicId(v);
                  setSelectedSubTopicId('');
                }}
                placeholder="Select Topic"
                items={topics.map(t => ({ id: t.id, name: t.name }))}
                createLabel="Topic"
                onCreate={(name) => addTopic({ name, subjectId: selectedSubjectId })}
              />
            )}

            {selectedTopicId && (
              <QuickCreateSelect
                value={selectedSubTopicId}
                onValueChange={setSelectedSubTopicId}
                placeholder="Select Sub-Topic"
                items={subTopics.map(st => ({ id: st.id, name: st.name }))}
                createLabel="Sub-Topic"
                onCreate={(name) => addSubTopic({ name, topicId: selectedTopicId })}
              />
            )}
          </div>

          {/* Clip Type */}
          <div className="space-y-2">
            <Label>Clip Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isPrimary ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsPrimary(true)}
                className={cn(isPrimary && 'bg-clip-primary hover:bg-clip-primary/90')}
              >
                <Star className="w-4 h-4 mr-2" />
                Primary
              </Button>
              <Button
                type="button"
                variant={!isPrimary ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsPrimary(false)}
                className={cn(!isPrimary && 'bg-clip-supplementary hover:bg-clip-supplementary/90')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Supplementary
              </Button>
            </div>
          </div>

          {/* Label & Notes */}
          <div className="space-y-2">
            <Label htmlFor="label">Label (optional)</Label>
            <Input
              id="label"
              placeholder="e.g., Best explanation of French Revolution causes"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-background border-input resize-none"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!videoUrl || !startTime || !endTime || !selectedSubTopicId}
            >
              Add Clip
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
