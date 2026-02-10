import { useState } from 'react';
import { BookOpen, Library, Video, Plus, Settings, ChevronRight, GraduationCap, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudyStore } from '@/stores/studyStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateExamDialog } from './CreateExamDialog';

interface SidebarProps {
  activeView: 'dashboard' | 'sources' | 'clips' | 'topic' | 'playlist-browser' | 'video-player' | 'pdf-reader';
  onViewChange: (view: 'dashboard' | 'sources' | 'clips' | 'topic' | 'playlist-browser' | 'video-player' | 'pdf-reader') => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [showCreateExam, setShowCreateExam] = useState(false);
  const { exams, selectedExamId, setSelectedExam } = useStudyStore();

  return (
    <>
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">StudyBrain</h1>
              <p className="text-xs text-muted-foreground">Clip-first revision</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <NavItem 
            icon={BookOpen} 
            label="Dashboard" 
            active={activeView === 'dashboard'}
            onClick={() => onViewChange('dashboard')}
          />
          <NavItem 
            icon={Library} 
            label="Source Library" 
            active={activeView === 'sources'}
            onClick={() => onViewChange('sources')}
          />
          <NavItem 
            icon={Video} 
            label="Add Clips" 
            active={activeView === 'clips'}
            onClick={() => onViewChange('clips')}
          />
          <NavItem 
            icon={FileText} 
            label="PDF Reader" 
            active={activeView === 'pdf-reader'}
            onClick={() => onViewChange('pdf-reader')}
          />
        </nav>

        {/* Exams List */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Exams
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 hover:bg-sidebar-accent"
              onClick={() => setShowCreateExam(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 pb-4">
              {exams.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2 py-4">
                  No exams yet. Create one to get started!
                </p>
              ) : (
                exams.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => {
                      setSelectedExam(exam.id);
                      onViewChange('dashboard');
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                      selectedExamId === exam.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <span className="text-lg">{exam.icon || '📚'}</span>
                    <span className="flex-1 text-left truncate">{exam.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </aside>

      <CreateExamDialog open={showCreateExam} onOpenChange={setShowCreateExam} />
    </>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-primary/10 text-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
