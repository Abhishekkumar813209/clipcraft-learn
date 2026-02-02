import { Plus, BookOpen, Layers, FileText } from 'lucide-react';
import { useStudyStore } from '@/stores/studyStore';
import { Button } from '@/components/ui/button';
import { SubjectCard } from './SubjectCard';
import { CreateSubjectDialog } from './CreateSubjectDialog';
import { useState } from 'react';

interface DashboardViewProps {
  onViewChange: (view: 'dashboard' | 'sources' | 'clips' | 'topic') => void;
}

export function DashboardView({ onViewChange }: DashboardViewProps) {
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const { exams, selectedExamId, getSubjectsByExam, clips } = useStudyStore();
  
  const selectedExam = exams.find((e) => e.id === selectedExamId);
  const subjects = selectedExamId ? getSubjectsByExam(selectedExamId) : [];

  if (!selectedExam) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-primary">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-3">Welcome to StudyBrain</h2>
          <p className="text-muted-foreground mb-6">
            Your personal revision engine. Start by creating an exam to organize your study materials.
          </p>
          <p className="text-sm text-muted-foreground">
            Select an exam from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalClips = clips.length;
  const totalTopics = subjects.reduce((acc, s) => acc + (s.topics?.length || 0), 0);
  const totalSubTopics = subjects.reduce(
    (acc, s) => acc + (s.topics?.reduce((a, t) => a + (t.subTopics?.length || 0), 0) || 0),
    0
  );

  return (
    <>
      <div className="flex-1 overflow-auto p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl">{selectedExam.icon}</span>
            <div>
              <h1 className="font-display text-3xl font-bold">{selectedExam.name}</h1>
              {selectedExam.description && (
                <p className="text-muted-foreground mt-1">{selectedExam.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Subjects" value={subjects.length} />
          <StatCard icon={Layers} label="Topics" value={totalTopics} />
          <StatCard icon={FileText} label="Clips" value={totalClips} />
        </div>

        {/* Subjects Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">Subjects</h2>
          <Button onClick={() => setShowCreateSubject(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </div>

        {subjects.length === 0 ? (
          <div className="clip-card text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2">No subjects yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add your first subject to start organizing your study material.
            </p>
            <Button onClick={() => setShowCreateSubject(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <SubjectCard 
                key={subject.id} 
                subject={subject} 
                index={index}
                onViewTopic={() => onViewChange('topic')}
              />
            ))}
          </div>
        )}
      </div>

      <CreateSubjectDialog 
        open={showCreateSubject} 
        onOpenChange={setShowCreateSubject}
        examId={selectedExamId!}
      />
    </>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="clip-card flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
