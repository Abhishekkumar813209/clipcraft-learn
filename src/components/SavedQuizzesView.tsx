import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, ChevronDown, ChevronRight, Trash2, FileText, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SavedQuiz {
  id: string;
  name: string;
  pdf_name: string | null;
  page_range: string | null;
  questions: any[];
  language: string;
  created_at: string;
  folder_id: string | null;
}

interface QuizFolder {
  id: string;
  name: string;
}

export function SavedQuizzesView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<QuizFolder[]>([]);
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['unfiled']));
  const [activeQuiz, setActiveQuiz] = useState<SavedQuiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<SavedQuiz | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<QuizFolder | null>(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    const [{ data: f }, { data: q }] = await Promise.all([
      supabase.from('pdf_quiz_folders').select('id, name').eq('user_id', user.id).order('name'),
      supabase.from('pdf_saved_quizzes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);
    setFolders(f || []);
    setQuizzes((q || []) as SavedQuiz[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;
    const { error } = await supabase.from('pdf_saved_quizzes').delete().eq('id', deletingQuiz.id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Quiz deleted');
    setDeletingQuiz(null);
    fetchData();
  };

  const handleDeleteFolder = async () => {
    if (!deletingFolder) return;
    const { error } = await supabase.from('pdf_quiz_folders').delete().eq('id', deletingFolder.id);
    if (error) { toast.error('Failed to delete folder'); return; }
    toast.success('Folder deleted');
    setDeletingFolder(null);
    fetchData();
  };

  const unfiledQuizzes = quizzes.filter(q => !q.folder_id);
  const getQuizzesForFolder = (folderId: string) => quizzes.filter(q => q.folder_id === folderId);

  // Removed inline quiz view — now uses URL routes

  const renderQuizCard = (quiz: SavedQuiz) => {
    const hasResults = !!(quiz as any).ai_feedback;
    return (
      <div key={quiz.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group" onClick={() => navigate(hasResults ? `/quizzes/${quiz.id}/analysis` : `/quizzes/${quiz.id}`)}>
        <Brain className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{quiz.name}</p>
            {hasResults && <span className="text-[10px] bg-green-500/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">Results</span>}
          </div>
          <p className="text-xs text-muted-foreground">
            {quiz.pdf_name && `${quiz.pdf_name} · `}
            {quiz.page_range && `Page ${quiz.page_range} · `}
            {quiz.questions.length} Q · {new Date(quiz.created_at).toLocaleDateString()}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive" onClick={(e) => { e.stopPropagation(); setDeletingQuiz(quiz); }}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          My Saved Quizzes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Revise your saved PDF quizzes organized by folders</p>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Brain className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg">No saved quizzes yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Generate a quiz from a PDF and save it for later revision</p>
            <Button className="mt-4" onClick={() => navigate('/pdf')}>Open PDF Reader</Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {/* Folders */}
            {folders.map(folder => {
              const folderQuizzes = getQuizzesForFolder(folder.id);
              const isExpanded = expandedFolders.has(folder.id);
              return (
                <div key={folder.id} className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleFolder(folder.id)}>
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <FolderOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm flex-1">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">{folderQuizzes.length} quizzes</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); setDeletingFolder(folder); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {isExpanded && (
                    <div className="p-2 space-y-2">
                      {folderQuizzes.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-3">No quizzes in this folder</p>
                      ) : folderQuizzes.map(renderQuizCard)}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Unfiled quizzes */}
            {unfiledQuizzes.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleFolder('unfiled')}>
                  {expandedFolders.has('unfiled') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm flex-1">Unfiled</span>
                  <span className="text-xs text-muted-foreground">{unfiledQuizzes.length} quizzes</span>
                </div>
                {expandedFolders.has('unfiled') && (
                  <div className="p-2 space-y-2">
                    {unfiledQuizzes.map(renderQuizCard)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Delete Quiz Dialog */}
      <AlertDialog open={!!deletingQuiz} onOpenChange={(o) => !o && setDeletingQuiz(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deletingQuiz?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This quiz will be permanently deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuiz} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Folder Dialog */}
      <AlertDialog open={!!deletingFolder} onOpenChange={(o) => !o && setDeletingFolder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete folder "{deletingFolder?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>Quizzes inside will become unfiled, not deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFolder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
