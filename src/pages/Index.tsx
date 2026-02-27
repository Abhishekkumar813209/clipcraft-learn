import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { SourceLibraryView } from '@/components/SourceLibraryView';
import { AddClipsView } from '@/components/AddClipsView';
import { TopicView } from '@/components/TopicView';
import { PlaylistBrowserView } from '@/components/PlaylistBrowserView';
import { VideoPlayerView } from '@/components/VideoPlayerView';
import { PdfReaderView } from '@/components/PdfReaderView';
import { useStudyStore } from '@/stores/studyStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeft, Loader2 } from 'lucide-react';

type ViewType = 'dashboard' | 'sources' | 'clips' | 'topic' | 'playlist-browser' | 'video-player' | 'pdf-reader';

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { selectedVideoForPlayer, setSelectedVideoForPlayer, setSelectedSource, fetchAllData, loading } = useStudyStore();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleSelectVideo = (video: { videoId: string; title: string }) => {
    setSelectedVideoForPlayer(video);
    setActiveView('video-player');
  };

  const handleBrowsePlaylist = (sourceId: string) => {
    setSelectedSource(sourceId);
    setActiveView('playlist-browser');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onViewChange={setActiveView as (view: string) => void} />;
      case 'sources':
        return <SourceLibraryView onBrowsePlaylist={handleBrowsePlaylist} />;
      case 'clips':
        return <AddClipsView />;
      case 'topic':
        return <TopicView onBack={() => setActiveView('dashboard')} />;
      case 'playlist-browser':
        return (
          <PlaylistBrowserView 
            onBack={() => setActiveView('sources')} 
            onSelectVideo={handleSelectVideo}
          />
        );
      case 'video-player':
        return selectedVideoForPlayer ? (
          <VideoPlayerView 
            videoId={selectedVideoForPlayer.videoId}
            videoTitle={selectedVideoForPlayer.title}
            onBack={() => setActiveView('playlist-browser')}
          />
        ) : (
          <DashboardView onViewChange={setActiveView as (view: string) => void} />
        );
      case 'pdf-reader':
        return <PdfReaderView onBack={() => setActiveView('dashboard')} />;
      default:
        return <DashboardView onViewChange={setActiveView as (view: string) => void} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!sidebarCollapsed && (
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      )}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 z-10 h-8 w-8"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
        >
          {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
