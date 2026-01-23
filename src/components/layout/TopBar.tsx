import { Search, Globe, Bell, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import gostudsLogo from '@/assets/gostuds-logo.png';
import { notifications } from '@/data/mockNotifications';

interface TopBarProps {
  onNewProject?: () => void;
  onNewTask?: () => void;
}

export function TopBar({ onNewProject, onNewTask }: TopBarProps) {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={gostudsLogo} alt="GoStuds" className="h-8" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Globe className="h-5 w-5" />
          <span className="text-xs">My Circle</span>
        </button>
        <Link to="/notifications" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="text-xs">Notifications</span>
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
        </Link>
        <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">Messaging</span>
        </button>
      </div>
    </header>
  );
}
