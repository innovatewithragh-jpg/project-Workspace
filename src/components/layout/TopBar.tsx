import { Search, Globe, Bell, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import gostudsLogo from '@/assets/gostuds-logo.png';
import { notifications } from '@/data/mockNotifications';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TopBarProps {
  onNewProject?: () => void;
  onNewTask?: () => void;
}

export function TopBar({ onNewProject, onNewTask }: TopBarProps) {
  const isMobile = useIsMobile();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-14 md:h-16 border-b border-border bg-background flex items-center justify-between px-3 md:px-6">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={gostudsLogo} alt="GoStuds" className="h-6 md:h-8" />
        </Link>
      </div>

      {/* Right Icons */}
      <TooltipProvider>
        <div className="flex items-center gap-3 md:gap-6">
          {/* Search - icon only on mobile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex flex-col items-center gap-0.5 md:gap-1 text-muted-foreground hover:text-foreground transition-colors p-1.5 md:p-0">
                <Search className="h-5 w-5" />
                {!isMobile && <span className="text-xs">Search</span>}
              </button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>

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
