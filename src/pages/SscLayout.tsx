import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Grid3X3, Trophy, BookMarked, FileText, ArrowLeft, Sparkles, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/ssc', icon: BookOpen },
  { label: 'Practice', path: '/ssc/practice', icon: Grid3X3 },
  { label: 'Vocabulary', path: '/ssc/vocab', icon: BookMarked },
  { label: 'Black Book Hub', path: '/ssc/blackbook', icon: Sparkles },
  { label: 'BB Practice', path: '/ssc/blackbook/practice/mixed', icon: Grid3X3 },
  { label: 'BB Browse', path: '/ssc/blackbook/browse/mixed', icon: Search },
  { label: 'PYQ Mode', path: '/ssc/pyq', icon: Trophy, disabled: true },
  { label: 'Mock Test', path: '/ssc/mock', icon: FileText, disabled: true },
];

export default function SscLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/ssc') return location.pathname === '/ssc';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col bg-card">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">SSC Prep</h1>
              <p className="text-xs text-muted-foreground">Master your exams</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => !item.disabled && navigate(item.path)}
              disabled={item.disabled}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : item.disabled
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.disabled && (
                <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Soon</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
            Back to StudyBrain
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
