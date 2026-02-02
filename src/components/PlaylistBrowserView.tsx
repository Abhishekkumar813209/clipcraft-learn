import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Search, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudyStore } from '@/stores/studyStore';
import { supabase } from '@/integrations/supabase/client';
import { formatDuration } from '@/types';

interface PlaylistVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  position: number;
  channelName: string;
}

interface PlaylistBrowserViewProps {
  onBack: () => void;
  onSelectVideo: (video: PlaylistVideo) => void;
}

export function PlaylistBrowserView({ onBack, onSelectVideo }: PlaylistBrowserViewProps) {
  const { sources, selectedSourceId } = useStudyStore();
  const [videos, setVideos] = useState<PlaylistVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<PlaylistVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const source = sources.find(s => s.id === selectedSourceId);

  useEffect(() => {
    async function fetchVideos() {
      if (!source || source.type !== 'playlist') {
        setLoading(false);
        setError('Please select a playlist source');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use fetch directly for GET with query params
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube-playlist?playlistId=${source.youtubeId}&fetchAll=true`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch playlist videos');
        }

        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }

        setVideos(result.videos || []);
        setFilteredVideos(result.videos || []);
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError(err instanceof Error ? err.message : 'Failed to load playlist');
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [source]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videos);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredVideos(
        videos.filter(v => 
          v.title.toLowerCase().includes(query) ||
          v.channelName.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, videos]);

  return (
    <div className="flex-1 overflow-auto p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">
            {source?.title || 'Playlist Browser'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {videos.length} videos
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading playlist videos...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="clip-card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">Failed to load</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Videos List */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredVideos.map((video, index) => (
            <div
              key={video.videoId}
              className="clip-card flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-all animate-fade-in"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
              onClick={() => onSelectVideo(video)}
            >
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-secondary">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium line-clamp-2 mb-1">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.channelName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  #{video.position + 1} in playlist
                </p>
              </div>

              {/* Play Button */}
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Play className="w-5 h-5" />
              </Button>
            </div>
          ))}

          {filteredVideos.length === 0 && videos.length > 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No videos match your search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
