import {
  Search,
  Bell,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TopBarProps {
  onNewProject?: () => void;
  onNewTask?: () => void;
}

export function TopBar({ onNewProject, onNewTask }: TopBarProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-foreground tracking-tight">
          Go<span className="text-primary">Studs</span>
        </Link>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-xl mx-6">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-10 pl-11 pr-4 rounded-full bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Right section - Icon buttons with labels */}
      <div className="flex items-center gap-6">
        <Button variant="ghost" className="flex flex-col items-center gap-0.5 h-auto py-1 px-2 hover:bg-transparent">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">My Circle</span>
        </Button>

        <Button variant="ghost" className="flex flex-col items-center gap-0.5 h-auto py-1 px-2 hover:bg-transparent relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Notifications</span>
        </Button>

        <Button variant="ghost" className="flex flex-col items-center gap-0.5 h-auto py-1 px-2 hover:bg-transparent">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Messaging</span>
        </Button>
      </div>
    </header>
  );
}
