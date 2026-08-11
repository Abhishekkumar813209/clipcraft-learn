import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Upload, ListChecks, Users, BookOpenText, Home } from 'lucide-react';
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
      <aside className="w-60 border-r border-border bg-card p-4 hidden md:flex md:flex-col">
        <div className="text-lg font-semibold mb-6 text-primary">Admin Panel</div>
        <nav className="space-y-1 flex-1">
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
        <Link
          to="/"
          className="mt-4 flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-border text-muted-foreground hover:bg-muted transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="md:hidden border-b border-border p-3 flex gap-2 overflow-x-auto">
          <Link to="/" className="shrink-0 px-3 py-1.5 rounded-md text-xs bg-muted text-muted-foreground flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
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
