import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { SourceLibraryView } from '@/components/SourceLibraryView';
import { AddClipsView } from '@/components/AddClipsView';
import { TopicView } from '@/components/TopicView';
import { PlaylistBrowserView } from '@/components/PlaylistBrowserView';
import { VideoPlayerView } from '@/components/VideoPlayerView';
import { PdfReaderView } from '@/components/PdfReaderView';
import { useStudyStore } from '@/stores/studyStore';

type ViewType = 'dashboard' | 'sources' | 'clips' | 'topic' | 'playlist-browser' | 'video-player' | 'pdf-reader';

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const { selectedVideoForPlayer, setSelectedVideoForPlayer, setSelectedSource } = useStudyStore();

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
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
