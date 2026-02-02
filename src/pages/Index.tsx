import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { SourceLibraryView } from '@/components/SourceLibraryView';
import { AddClipsView } from '@/components/AddClipsView';
import { TopicView } from '@/components/TopicView';

type ViewType = 'dashboard' | 'sources' | 'clips' | 'topic';

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onViewChange={setActiveView} />;
      case 'sources':
        return <SourceLibraryView />;
      case 'clips':
        return <AddClipsView />;
      case 'topic':
        return <TopicView onBack={() => setActiveView('dashboard')} />;
      default:
        return <DashboardView onViewChange={setActiveView} />;
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
