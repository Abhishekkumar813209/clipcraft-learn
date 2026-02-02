import { useState } from 'react';
import { ChevronRight, MoreVertical, Plus, Layers } from 'lucide-react';
import { Subject } from '@/types';
import { useStudyStore } from '@/stores/studyStore';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreateTopicDialog } from './CreateTopicDialog';

const SUBJECT_COLORS = [
  'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  'from-rose-500/20 to-red-500/20 border-rose-500/30',
  'from-indigo-500/20 to-violet-500/20 border-indigo-500/30',
];

interface SubjectCardProps {
  subject: Subject;
  index: number;
  onViewTopic: () => void;
}

export function SubjectCard({ subject, index, onViewTopic }: SubjectCardProps) {
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { deleteSubject, setSelectedSubject, setSelectedTopic, clips } = useStudyStore();
  
  const topics = subject.topics || [];
  const colorClass = SUBJECT_COLORS[index % SUBJECT_COLORS.length];
  const totalClips = topics.reduce(
    (acc, t) => acc + (t.subTopics?.reduce((a, st) => a + clips.filter(c => c.subTopicId === st.id).length, 0) || 0),
    0
  );

  const handleTopicClick = (topicId: string) => {
    setSelectedSubject(subject.id);
    setSelectedTopic(topicId);
    onViewTopic();
  };

  return (
    <>
      <div 
        className={`clip-card bg-gradient-to-br ${colorClass} cursor-pointer animate-fade-in`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1" onClick={() => setExpanded(!expanded)}>
            <h3 className="font-display font-semibold text-lg">{subject.name}</h3>
            {subject.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {subject.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem onClick={() => setShowCreateTopic(true)}>
                Add Topic
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => deleteSubject(subject.id)}
              >
                Delete Subject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Layers className="w-4 h-4" />
            {topics.length} topics
          </span>
          <span>{totalClips} clips</span>
        </div>

        {/* Topics Preview */}
        {expanded && topics.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border/50">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                className="w-full flex items-center justify-between p-2 rounded-md bg-background/30 hover:bg-background/50 transition-colors text-sm"
              >
                <span>{topic.name}</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{topic.subTopics?.length || 0} sub-topics</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        )}

        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Collapse' : `View ${topics.length} topics`}
          <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </Button>
      </div>

      <CreateTopicDialog 
        open={showCreateTopic}
        onOpenChange={setShowCreateTopic}
        subjectId={subject.id}
      />
    </>
  );
}
