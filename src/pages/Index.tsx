import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { useStudyStore } from '@/stores/studyStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeft, Loader2 } from 'lucide-react';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { fetchAllData, loading } = useStudyStore();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!sidebarCollapsed && <Sidebar />}
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
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
