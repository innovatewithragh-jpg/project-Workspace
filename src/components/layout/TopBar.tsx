import { useState } from 'react';
import { Search, Globe, Bell, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import gostudsLogo from '@/assets/gostuds-logo.png';
import gostudsLogoDark from '@/assets/gostuds-logo-dark.png';
import { notifications } from '@/data/mockNotifications';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/use-theme';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

interface TopBarProps {
  onNewProject?: () => void;
  onNewTask?: () => void;
}

export function TopBar({ onNewProject, onNewTask }: TopBarProps) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-14 md:h-16 border-b border-border bg-background flex items-center justify-between px-3 md:px-6">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={theme === 'dark' ? gostudsLogoDark : gostudsLogo} alt="GoStuds" className="h-6 md:h-8" />
        </Link>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border-border/50"
          />
        </div>
      </div>

      {/* Right Icons */}
      <TooltipProvider>
        <div className="flex items-center gap-3 md:gap-5">
          {/* My Circle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex flex-col items-center gap-0.5 md:gap-1 text-muted-foreground hover:text-foreground transition-colors p-1.5 md:p-0">
                <Globe className="h-5 w-5" />
                {!isMobile && <span className="text-xs">My Circle</span>}
              </button>
            </TooltipTrigger>
            <TooltipContent>My Circle</TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to="/notifications" 
                className="flex flex-col items-center gap-0.5 md:gap-1 text-muted-foreground hover:text-foreground transition-colors relative p-1.5 md:p-0"
              >
                <Bell className="h-5 w-5" />
                {!isMobile && <span className="text-xs">Notifications</span>}
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 md:-top-1 right-0 md:-right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          {/* Messaging */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex flex-col items-center gap-0.5 md:gap-1 text-muted-foreground hover:text-foreground transition-colors p-1.5 md:p-0">
                <MessageCircle className="h-5 w-5" />
                {!isMobile && <span className="text-xs">Messaging</span>}
              </button>
            </TooltipTrigger>
            <TooltipContent>Messaging</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </header>
  );
}
