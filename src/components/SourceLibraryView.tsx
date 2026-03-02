import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Link, Youtube, Trash2, ExternalLink, FolderOpen, List } from 'lucide-react';
import { useStudyStore } from '@/stores/studyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { extractYouTubeId } from '@/types';

export function SourceLibraryView() {
  const [showAddSource, setShowAddSource] = useState(false);
  const { sources, deleteSource, setSelectedSource } = useStudyStore();
  const navigate = useNavigate();

  const handleBrowsePlaylist = (sourceId: string) => {
    setSelectedSource(sourceId);
    navigate(`/sources/${sourceId}`);
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold">Source Library</h1>
          <p className="text-muted-foreground mt-1">
            Save YouTube playlists and channels once, reuse forever
          </p>
        </div>
        <Button onClick={() => setShowAddSource(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* Sources Grid */}
      {sources.length === 0 ? (
        <div className="clip-card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Youtube className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">No saved sources</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Save your favorite YouTube playlists or channels here.
          </p>
          <Button onClick={() => setShowAddSource(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Source
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source, index) => (
            <div 
              key={source.id} 
              className="clip-card animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  {source.type === 'playlist' ? (
                    <FolderOpen className="w-6 h-6 text-destructive" />
                  ) : (
                    <Youtube className="w-6 h-6 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{source.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{source.type}</p>
                  {source.videoCount && (
                    <p className="text-xs text-muted-foreground mt-1">{source.videoCount} videos</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                {source.type === 'playlist' && (
                  <Button variant="default" size="sm" className="flex-1" onClick={() => handleBrowsePlaylist(source.id)}>
                    <List className="w-4 h-4 mr-2" />
                    Browse Videos
                  </Button>
                )}
                <Button variant="ghost" size="sm" className={source.type !== 'playlist' ? 'flex-1' : ''}
                  onClick={() => {
                    const url = source.type === 'playlist'
                      ? `https://youtube.com/playlist?list=${source.youtubeId}`
                      : `https://youtube.com/channel/${source.youtubeId}`;
                    window.open(url, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteSource(source.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddSourceDialog open={showAddSource} onOpenChange={setShowAddSource} />
    </div>
  );
}

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddSourceDialog({ open, onOpenChange }: AddSourceDialogProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'playlist' | 'channel'>('playlist');
  const { addSource } = useStudyStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const youtubeId = extractYouTubeId(url);
    if (!youtubeId || !title.trim()) return;
    await addSource({ type, youtubeId, title: title.trim() });
    setUrl('');
    setTitle('');
    setType('playlist');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add YouTube Source</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Source Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as 'playlist' | 'channel')}>
              <SelectTrigger className="bg-background border-input"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="playlist">Playlist</SelectItem>
                <SelectItem value="channel">Channel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">YouTube URL</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="url" placeholder={type === 'playlist' ? 'https://youtube.com/playlist?list=...' : 'https://youtube.com/channel/...'} value={url} onChange={(e) => setUrl(e.target.value)} className="pl-10 bg-background border-input" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Display Name</Label>
            <Input id="title" placeholder="e.g., PW History Marathon" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background border-input" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!url.trim() || !title.trim()}>Add Source</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
