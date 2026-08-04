import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Upload, ListChecks, Users, BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/books', label: 'Books & Topics', icon: BookOpen },
  { to: '/admin/upload', label: 'Upload PDF', icon: Upload },
  { to: '/admin/questions', label: 'Questions', icon: ListChecks },
  { to: '/admin/users', label: 'Users (7d)', icon: Users },
  { to: '/admin/upsc-theory', label: 'UPSC Theory', icon: BookOpenText },
  { to: '/admin/ssc-theory', label: 'SSC Theory', icon: BookOpenText },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside className="w-60 border-r border-border bg-card p-4 hidden md:block">
        <div className="text-lg font-semibold mb-6 text-primary">Admin Panel</div>
        <nav className="space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted',
                )
              }
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="md:hidden border-b border-border p-3 flex gap-2 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'shrink-0 px-3 py-1.5 rounded-md text-xs',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </main>
    </div>
  );
}
