import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Loader2, Pencil, Check } from 'lucide-react';
import { trainerBySlug, TRAINER_BASE } from '@/data/mathsTrainers';
import { useTrainerEditor } from '@/hooks/useTrainerEditor';

export default function SscMathsTrainer() {
  const nav = useNavigate();
  const { topic, slug } = useParams<{ topic: string; slug: string }>();
  const trainer = trainerBySlug(topic || '', slug || '');
  const { iframeRef, onIframeLoad, isAdmin, editMode, setEditMode, saving } = useTrainerEditor(
    `ssc-maths/${slug || ''}`,
  );

  if (!trainer) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => nav(`/ssc/maths/${topic}`)}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <p className="text-muted-foreground">Trainer nahi mila.</p>
      </div>
    );
  }

  const src = `${TRAINER_BASE}${trainer.file}`;

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="h-14 shrink-0 border-b border-border bg-card flex items-center gap-2 px-3">
        <Button variant="ghost" size="sm" onClick={() => nav(`/ssc/maths/${topic}`)}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{trainer.title}</p>
          <p className="text-xs text-muted-foreground truncate">
            {editMode ? 'Edit mode — double-click karke text badlo, Esc/Ctrl+S se save' : trainer.subtitle}
          </p>
        </div>
        {isAdmin && (
          <Button
            variant={editMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : editMode ? <Check className="w-4 h-4 mr-1" /> : <Pencil className="w-4 h-4 mr-1" />}
            {editMode ? 'Done' : 'Edit'}
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <a href={src} target="_blank" rel="noreferrer">
            <ExternalLink className="w-4 h-4 mr-1" />Full screen
          </a>
        </Button>
      </div>
      <iframe
        ref={iframeRef}
        onLoad={onIframeLoad}
        src={src}
        title={trainer.title}
        className="flex-1 w-full border-0 bg-background"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}
