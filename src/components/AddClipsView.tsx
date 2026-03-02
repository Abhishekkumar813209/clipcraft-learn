import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Video, Clock, Star, Sparkles, Trash2, Play, Copy, FolderOpen, FileText, Film } from 'lucide-react';
import { useStudyStore } from '@/stores/studyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickCreateSelect } from '@/components/QuickCreateSelect';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { extractYouTubeId, formatDuration, parseTimeToSeconds } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AddClipsView() {
  const [showAddClip, setShowAddClip] = useState(false);
  const { exams, clips, videos, deleteClip } = useStudyStore();
  const hasClips = clips.length > 0;

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold">Add Clips</h1>
          <p className="text-muted-foreground mt-1">Create clips from YouTube videos and assign them to concepts</p>
        </div>
        <Button onClick={() => setShowAddClip(true)} disabled={exams.length === 0}>
          <Plus className="w-4 h-4 mr-2" />New Clip
        </Button>
      </div>

      {exams.length === 0 ? (
        <div className="clip-card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">Create an exam first</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Before adding clips, you need to create an exam structure.</p>
        </div>
      ) : (
        <>
          <div className="clip-card mb-8">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />Quick Add Workflow
            </h2>
            <p className="text-muted-foreground text-sm mb-4">Daily study made simple: Watch a lecture → Spot a great explanation → Add it as a clip → Continue watching.</p>
            <Button onClick={() => setShowAddClip(true)}>
              <Plus className="w-4 h-4 mr-2" />Add New Clip
            </Button>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold mb-4">All Clips</h2>
            {!hasClips ? (
              <div className="clip-card text-center py-8">
                <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No clips added yet</p>
              </div>
            ) : (
              <ClipsTree exams={exams} clips={clips} videos={videos} deleteClip={deleteClip} />
            )}
          </div>
        </>
      )}

      <AddClipDialog open={showAddClip} onOpenChange={setShowAddClip} />
    </div>
  );
}

function ClipsTree({ exams, clips, videos, deleteClip }: { exams: any[]; clips: any[]; videos: any[]; deleteClip: (id: string) => void }) {
  const navigate = useNavigate();

  // Build lookup: subTopicId → clips grouped by videoId
  const clipsBySubTopic: Record<string, any[]> = {};
  for (const clip of clips) {
    if (!clipsBySubTopic[clip.subTopicId]) clipsBySubTopic[clip.subTopicId] = [];
    clipsBySubTopic[clip.subTopicId].push(clip);
  }

  const filteredExams = exams
    .map(exam => {
      const subjects = (exam.subjects || [])
        .map((subject: any) => {
          const topics = (subject.topics || [])
            .map((topic: any) => {
              const subTopics = (topic.subTopics || [])
                .filter((st: any) => clipsBySubTopic[st.id]?.length > 0)
                .map((st: any) => ({
                  ...st,
                  clips: (clipsBySubTopic[st.id] || []).sort((a: any, b: any) => a.startTime - b.startTime),
                }));
              return subTopics.length > 0 ? { ...topic, subTopics } : null;
            })
            .filter(Boolean);
          return topics.length > 0 ? { ...subject, topics } : null;
        })
        .filter(Boolean);
      return subjects.length > 0 ? { ...exam, subjects } : null;
    })
    .filter(Boolean);

  if (filteredExams.length === 0) {
    return (
      <div className="clip-card text-center py-8">
        <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">No clips added yet</p>
      </div>
    );
  }

  const copyClipLink = (video: any, clip: any) => {
    const url = `https://youtube.com/watch?v=${video.youtubeId}&t=${clip.startTime}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  const playClipInApp = (video: any, clip: any) => {
    navigate(`/player/${video.youtubeId}?start=${clip.startTime}&end=${clip.endTime}`);
  };

  return (
    <Accordion type="multiple" className="space-y-2">
      {filteredExams.map((exam: any) => (
        <AccordionItem key={exam.id} value={exam.id} className="clip-card border-none">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="flex items-center gap-2 text-base font-semibold">
              <span>{exam.icon || '📁'}</span>{exam.name}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple" className="pl-4 space-y-1">
              {exam.subjects.map((subject: any) => (
                <AccordionItem key={subject.id} value={subject.id} className="border-none">
                  <AccordionTrigger className="py-2 hover:no-underline text-sm">
                    <span className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-muted-foreground" />{subject.name}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="multiple" className="pl-4 space-y-1">
                      {subject.topics.map((topic: any) => (
                        <AccordionItem key={topic.id} value={topic.id} className="border-none">
                          <AccordionTrigger className="py-2 hover:no-underline text-sm">
                            <span className="flex items-center gap-2">
                              <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" />{topic.name}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-4 space-y-3">
                              {topic.subTopics.map((st: any) => {
                                // Group clips by videoId
                                const clipsByVideo: Record<string, any[]> = {};
                                for (const clip of st.clips) {
                                  if (!clipsByVideo[clip.videoId]) clipsByVideo[clip.videoId] = [];
                                  clipsByVideo[clip.videoId].push(clip);
                                }

                                return (
                                  <div key={st.id}>
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2 py-1">
                                      <FileText className="w-3.5 h-3.5" />
                                      {st.name}
                                      <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">{st.clips.length}</span>
                                    </div>
                                    <div className="space-y-3 pl-5">
                                      {Object.entries(clipsByVideo).map(([videoId, videoClips]) => {
                                        const video = videos.find((v: any) => v.id === videoId);
                                        return (
                                          <div key={videoId} className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-medium text-foreground/80 py-1">
                                              <Film className="w-3.5 h-3.5 text-primary/60" />
                                              <span className="truncate">{video?.title || 'Unknown Video'}</span>
                                              <span className="text-muted-foreground">({videoClips.length})</span>
                                            </div>
                                            <div className="space-y-1 pl-5">
                                              {videoClips.map((clip: any) => (
                                                <div key={clip.id} className="flex items-center gap-2 p-1.5 rounded bg-secondary/50 text-xs group">
                                                  {clip.isPrimary ? (
                                                    <Star className="w-3 h-3 text-clip-primary fill-clip-primary flex-shrink-0" />
                                                  ) : (
                                                    <Sparkles className="w-3 h-3 text-clip-supplementary flex-shrink-0" />
                                                  )}
                                                  <span className="font-mono text-primary">
                                                    {formatDuration(clip.startTime)} → {formatDuration(clip.endTime)}
                                                  </span>
                                                  <span className="text-muted-foreground truncate flex-1">
                                                    {clip.label || 'Clip'}
                                                  </span>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => video && playClipInApp(video, clip)} title="Play in app">
                                                    <Play className="w-3 h-3" />
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => video && copyClipLink(video, clip)} title="Copy YouTube link">
                                                    <Copy className="w-3 h-3" />
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive" onClick={() => deleteClip(clip.id)}>
                                                    <Trash2 className="w-3 h-3" />
                                                  </Button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
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

  const { exams, getSubjectsByExam, getTopicsBySubject, getSubTopicsByTopic, addVideo, addClip, addTopic, addSubTopic, getVideoByYouTubeId } = useStudyStore();
  const subjects = selectedExamId ? getSubjectsByExam(selectedExamId) : [];
  const topics = selectedSubjectId ? getTopicsBySubject(selectedSubjectId) : [];
  const subTopics = selectedTopicId ? getSubTopicsByTopic(selectedTopicId) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const youtubeId = extractYouTubeId(videoUrl);
    if (!youtubeId || !selectedSubTopicId || !startTime || !endTime) return;
    let video = getVideoByYouTubeId(youtubeId);
    let videoId: string;
    if (video) { videoId = video.id; }
    else { videoId = await addVideo({ youtubeId, title: videoTitle || 'Untitled Video', duration: 0 }); }
    await addClip({ videoId, startTime: parseTimeToSeconds(startTime), endTime: parseTimeToSeconds(endTime), label: label.trim() || undefined, notes: notes.trim() || undefined, isPrimary, subTopicId: selectedSubTopicId });
    setVideoUrl(''); setVideoTitle(''); setStartTime(''); setEndTime(''); setLabel(''); setNotes(''); setIsPrimary(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display text-xl">Add New Clip</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">YouTube Video URL</Label>
            <Input id="videoUrl" placeholder="https://youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="bg-background border-input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoTitle">Video Title (for display)</Label>
            <Input id="videoTitle" placeholder="e.g., Modern History Lecture 5" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="bg-background border-input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" placeholder="0:00 or 1:30:00" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-background border-input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" placeholder="5:00 or 1:45:30" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-background border-input" />
            </div>
          </div>
          <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
            <Label className="text-sm font-semibold">Assign to Concept</Label>
            <Select value={selectedExamId} onValueChange={(v) => { setSelectedExamId(v); setSelectedSubjectId(''); setSelectedTopicId(''); setSelectedSubTopicId(''); }}>
              <SelectTrigger className="bg-background border-input"><SelectValue placeholder="Select Exam" /></SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {exams.map((exam) => (<SelectItem key={exam.id} value={exam.id}>{exam.icon} {exam.name}</SelectItem>))}
              </SelectContent>
            </Select>
            {selectedExamId && (
              <Select value={selectedSubjectId} onValueChange={(v) => { setSelectedSubjectId(v); setSelectedTopicId(''); setSelectedSubTopicId(''); }}>
                <SelectTrigger className="bg-background border-input"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {subjects.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
                </SelectContent>
              </Select>
            )}
            {selectedSubjectId && (
              <QuickCreateSelect value={selectedTopicId} onValueChange={(v) => { setSelectedTopicId(v); setSelectedSubTopicId(''); }} placeholder="Select Topic" items={topics.map(t => ({ id: t.id, name: t.name }))} createLabel="Topic" onCreate={(name) => addTopic({ name, subjectId: selectedSubjectId })} />
            )}
            {selectedTopicId && (
              <QuickCreateSelect value={selectedSubTopicId} onValueChange={setSelectedSubTopicId} placeholder="Select Sub-Topic" items={subTopics.map(st => ({ id: st.id, name: st.name }))} createLabel="Sub-Topic" onCreate={(name) => addSubTopic({ name, topicId: selectedTopicId })} />
            )}
          </div>
          <div className="space-y-2">
            <Label>Clip Type</Label>
            <div className="flex gap-2">
              <Button type="button" variant={isPrimary ? 'default' : 'outline'} size="sm" onClick={() => setIsPrimary(true)} className={cn(isPrimary && 'bg-clip-primary hover:bg-clip-primary/90')}>
                <Star className="w-4 h-4 mr-2" />Primary
              </Button>
              <Button type="button" variant={!isPrimary ? 'default' : 'outline'} size="sm" onClick={() => setIsPrimary(false)} className={cn(!isPrimary && 'bg-clip-supplementary hover:bg-clip-supplementary/90')}>
                <Sparkles className="w-4 h-4 mr-2" />Supplementary
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Label (optional)</Label>
            <Input id="label" placeholder="e.g., Best explanation of French Revolution causes" value={label} onChange={(e) => setLabel(e.target.value)} className="bg-background border-input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="Add any additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-background border-input resize-none" rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!videoUrl || !selectedSubTopicId || !startTime || !endTime}>
              <Plus className="w-4 h-4 mr-2" />Add Clip
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
