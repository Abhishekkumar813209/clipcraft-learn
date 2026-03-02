import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Play, Pause, SkipBack, SkipForward, Plus, Check, MessageSquare, Trash2, Star, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuickCreateSelect } from '@/components/QuickCreateSelect';
import { VideoChatSidebar } from '@/components/VideoChatSidebar';
import { useStudyStore } from '@/stores/studyStore';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { formatDuration } from '@/types';
import { toast } from 'sonner';

export function VideoPlayerView() {
  const { videoId: routeVideoId } = useParams<{ videoId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const videoId = routeVideoId || '';
  const clipStartTime = searchParams.get('start') ? Number(searchParams.get('start')) : undefined;
  const clipEndTime = searchParams.get('end') ? Number(searchParams.get('end')) : undefined;
  const isClipMode = clipStartTime !== undefined && clipEndTime !== undefined;

  const { selectedVideoForPlayer } = useStudyStore();
  const videoTitle = selectedVideoForPlayer?.title || 'Video';

  const { 
    exams, 
    clips,
    videos,
    addVideo, 
    addClip,
    deleteClip,
    addTopic,
    addSubTopic,
    getSubjectsByExam, 
    getTopicsBySubject, 
    getSubTopicsByTopic 
  } = useStudyStore();

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  const [showChat, setShowChat] = useState(false);
  
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [selectedSubTopicId, setSelectedSubTopicId] = useState<string>('');

  const {
    isReady,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    seekTo,
    getCurrentTime,
  } = useYouTubePlayer({
    videoId,
    containerId: 'youtube-player',
    startTime: clipStartTime,
    endTime: clipEndTime,
  });

  // Get clips for current video
  const currentVideo = videos.find(v => v.youtubeId === videoId);
  const videoClips = useMemo(() => {
    if (!currentVideo) return [];
    return clips
      .filter(c => c.videoId === currentVideo.id)
      .sort((a, b) => a.startTime - b.startTime);
  }, [clips, currentVideo]);

  const subTopicNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const exam of exams) {
      for (const subject of exam.subjects || []) {
        for (const topic of subject.topics || []) {
          for (const st of topic.subTopics || []) {
            map[st.id] = st.name;
          }
        }
      }
    }
    return map;
  }, [exams]);

  const subjects = selectedExamId ? getSubjectsByExam(selectedExamId) : [];
  const topics = selectedSubjectId ? getTopicsBySubject(selectedSubjectId) : [];
  const subTopics = selectedTopicId ? getSubTopicsByTopic(selectedTopicId) : [];

  useEffect(() => { setSelectedSubjectId(''); setSelectedTopicId(''); setSelectedSubTopicId(''); }, [selectedExamId]);
  useEffect(() => { setSelectedTopicId(''); setSelectedSubTopicId(''); }, [selectedSubjectId]);
  useEffect(() => { setSelectedSubTopicId(''); }, [selectedTopicId]);

  const handleSetStart = () => {
    const time = getCurrentTime();
    setStartTime(Math.floor(time));
    toast.success(`Start time set: ${formatDuration(Math.floor(time))}`);
  };

  const handleSetEnd = () => {
    const time = getCurrentTime();
    setEndTime(Math.floor(time));
    toast.success(`End time set: ${formatDuration(Math.floor(time))}`);
  };

  const handleAddClip = async () => {
    if (startTime === null || endTime === null) { toast.error('Please set both start and end times'); return; }
    if (startTime >= endTime) { toast.error('End time must be after start time'); return; }
    if (!selectedSubTopicId) { toast.error('Please select a sub-topic'); return; }

    const storedVideoId = await addVideo({ youtubeId: videoId, title: videoTitle, duration });
    await addClip({ videoId: storedVideoId, startTime, endTime, label: label.trim() || undefined, isPrimary, subTopicId: selectedSubTopicId });
    toast.success('Clip added successfully!');
    setStartTime(null);
    setEndTime(null);
    setLabel('');
  };

  const clearClipMode = () => {
    setSearchParams({});
  };

  const canAddClip = startTime !== null && endTime !== null && selectedSubTopicId;

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-lg font-semibold truncate flex-1">{videoTitle}</h1>
            <Button variant={showChat ? "default" : "outline"} size="sm" onClick={() => setShowChat(!showChat)} className="gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Doubt
            </Button>
          </div>
          {/* Clip mode banner */}
          {isClipMode && (
            <div className="mt-2 flex items-center gap-3 bg-primary/10 rounded-lg px-4 py-2 text-sm">
              <Play className="w-4 h-4 text-primary" />
              <span className="font-mono text-primary font-semibold">
                Playing clip: {formatDuration(clipStartTime!)} → {formatDuration(clipEndTime!)}
              </span>
              <Button variant="ghost" size="sm" className="ml-auto gap-1" onClick={clearClipMode}>
                <X className="w-3 h-3" />
                Watch Full Video
              </Button>
            </div>
          )}
        </div>

        {/* Two-column layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Video + Controls (60%) */}
          <div className="w-[60%] flex flex-col overflow-auto p-6 space-y-4">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              <div id="youtube-player" className="w-full h-full" />
              {!isPlaying && isReady && (
                <div className="absolute inset-0 cursor-pointer z-10" onClick={() => play()} title="Click to resume" />
              )}
            </div>

            <div className="clip-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-lg font-mono">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-primary font-bold">{formatDuration(currentTime)}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{formatDuration(duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => seekTo(Math.max(0, currentTime - 10))} disabled={!isReady}><SkipBack className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" onClick={isPlaying ? pause : play} disabled={!isReady}>{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</Button>
                  <Button variant="ghost" size="icon" onClick={() => seekTo(Math.min(duration, currentTime + 10))} disabled={!isReady}><SkipForward className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-4">
                <div className="absolute inset-y-0 left-0 bg-primary/30 rounded-full" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
                {startTime !== null && endTime !== null && duration > 0 && (
                  <div className="absolute inset-y-0 bg-primary rounded-full" style={{ left: `${(startTime / duration) * 100}%`, width: `${((endTime - startTime) / duration) * 100}%` }} />
                )}
                {isClipMode && duration > 0 && (
                  <div className="absolute inset-y-0 bg-primary/50 rounded-full" style={{ left: `${(clipStartTime! / duration) * 100}%`, width: `${((clipEndTime! - clipStartTime!) / duration) * 100}%` }} />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant={startTime !== null ? "default" : "outline"} onClick={handleSetStart} disabled={!isReady} className="justify-between">
                  <span>Set Start</span>
                  <span className="font-mono text-sm opacity-70">{startTime !== null ? formatDuration(startTime) : '--:--'}</span>
                </Button>
                <Button variant={endTime !== null ? "default" : "outline"} onClick={handleSetEnd} disabled={!isReady} className="justify-between">
                  <span>Set End</span>
                  <span className="font-mono text-sm opacity-70">{endTime !== null ? formatDuration(endTime) : '--:--'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT: Form + Saved Clips (40%) */}
          <ScrollArea className="w-[40%] border-l border-border">
            <div className="p-6 space-y-4">
              <div className="clip-card space-y-4">
                <h3 className="font-display font-semibold">Assign to Sub-Topic</h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Exam</Label>
                    <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                      <SelectTrigger className="bg-background border-input h-9"><SelectValue placeholder="Select exam" /></SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {exams.map(exam => (<SelectItem key={exam.id} value={exam.id}>{exam.icon} {exam.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Subject</Label>
                    <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId} disabled={!selectedExamId}>
                      <SelectTrigger className="bg-background border-input h-9"><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {subjects.map(subject => (<SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Topic</Label>
                    <QuickCreateSelect value={selectedTopicId} onValueChange={setSelectedTopicId} placeholder="Select topic" disabled={!selectedSubjectId} items={topics.map(t => ({ id: t.id, name: t.name }))} createLabel="Topic" onCreate={(name) => addTopic({ name, subjectId: selectedSubjectId })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Sub-Topic</Label>
                    <QuickCreateSelect value={selectedSubTopicId} onValueChange={setSelectedSubTopicId} placeholder="Select sub-topic" disabled={!selectedTopicId} items={subTopics.map(st => ({ id: st.id, name: st.name }))} createLabel="Sub-Topic" onCreate={(name) => addSubTopic({ name, topicId: selectedTopicId })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Label (optional)</Label>
                  <Input placeholder="e.g., Best explanation of causes" value={label} onChange={(e) => setLabel(e.target.value)} className="bg-background border-input h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Clip Type</Label>
                  <div className="flex gap-2">
                    <Button variant={isPrimary ? "default" : "outline"} size="sm" onClick={() => setIsPrimary(true)}>
                      <Check className={`w-3 h-3 mr-1 ${isPrimary ? '' : 'opacity-0'}`} />Primary
                    </Button>
                    <Button variant={!isPrimary ? "default" : "outline"} size="sm" onClick={() => setIsPrimary(false)}>
                      <Check className={`w-3 h-3 mr-1 ${!isPrimary ? '' : 'opacity-0'}`} />Supplementary
                    </Button>
                  </div>
                </div>
                <Button className="w-full" onClick={handleAddClip} disabled={!canAddClip}>
                  <Plus className="w-4 h-4 mr-2" />Add Clip
                </Button>
              </div>

              <div className="clip-card space-y-3">
                <h3 className="font-display font-semibold text-sm">Saved Clips ({videoClips.length})</h3>
                {videoClips.length === 0 ? (
                  <p className="text-muted-foreground text-xs text-center py-4">No clips saved for this video yet</p>
                ) : (
                  <div className="space-y-2">
                    {videoClips.map(clip => (
                      <div key={clip.id} className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 text-sm">
                        {clip.isPrimary ? (
                          <Star className="w-3.5 h-3.5 text-clip-primary fill-clip-primary flex-shrink-0" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-clip-supplementary flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-xs text-primary">{formatDuration(clip.startTime)} → {formatDuration(clip.endTime)}</p>
                          <p className="text-xs text-muted-foreground truncate">{clip.label || subTopicNameMap[clip.subTopicId] || 'Clip'}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => { seekTo(clip.startTime); play(); }}>
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteClip(clip.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {showChat && (
        <VideoChatSidebar videoId={videoId} videoTitle={videoTitle} currentTime={currentTime} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
}
