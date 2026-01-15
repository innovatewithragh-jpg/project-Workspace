import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { currentUser } from '@/data/mockData';

interface TopBarProps {
  onNewProject?: () => void;
  onNewTask?: () => void;
}

export function TopBar({ onNewProject, onNewTask }: TopBarProps) {
  return (
    <header className="h-16 border-b border-border/50 bg-surface-elevated/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center">
        <span className="text-lg font-bold text-foreground tracking-tight">My Workspace</span>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search projects, tasks... (⌘K)"
            className="w-full h-10 pl-11 pr-4 rounded-xl bg-surface/80 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-surface transition-all duration-200"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <Button variant="glow" size="sm" className="gap-2 rounded-xl" onClick={onNewProject}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Project</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative hover:bg-surface-hover rounded-xl">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-surface-elevated" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full ring-2 ring-border/50 hover:ring-primary/30 transition-all">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-primary/10 text-primary">{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-xl border-border/50 shadow-xl">
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{currentUser.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="text-destructive gap-2 cursor-pointer focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
