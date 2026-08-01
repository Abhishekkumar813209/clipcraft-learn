import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { RBI_REASONING_TRAINERS, RBI_TRAINER_BASE } from './RbiReasoning';

export default function RbiReasoningTrainer() {
  const nav = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const trainer = RBI_REASONING_TRAINERS.find((t) => t.slug === slug);

  if (!trainer) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => nav('/rbi/reasoning')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <p className="text-muted-foreground">Trainer nahi mila.</p>
      </div>
    );
  }

  const src = `${RBI_TRAINER_BASE}${trainer.file}`;

  return (
    <div className="flex flex-col h-[calc(100dvh-3rem)] md:h-[100dvh] min-w-0">
      <div className="h-14 shrink-0 border-b border-border bg-card flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
        <Button variant="ghost" size="sm" className="px-2 shrink-0" onClick={() => nav('/rbi/reasoning')}>
          <ArrowLeft className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Back</span>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{trainer.title}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{trainer.subtitle}</p>
        </div>
        <Button variant="outline" size="sm" className="px-2 shrink-0" asChild>
          <a href={src} target="_blank" rel="noreferrer">
            <ExternalLink className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Full screen</span>
          </a>
        </Button>
      </div>
      <iframe
        src={src}
        title={trainer.title}
        className="flex-1 w-full border-0 bg-background"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}
