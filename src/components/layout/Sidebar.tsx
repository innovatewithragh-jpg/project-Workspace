import { Home, Search, Users, Zap, Trophy, Settings, ExternalLink, Sun, Moon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/data/mockData';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Find Projects', href: '/find-projects', icon: Search },
  { name: 'Find Teammates', href: '/find-teammates', icon: Users },
  { name: 'Aligned Profiles', href: '/aligned-profiles', icon: Zap },
  { name: 'Competition', href: '/competition', icon: Trophy },
];

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col">
      {/* User Profile Section */}
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-3">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-foreground">{currentUser.name}</h3>
          <Link 
            to="/settings" 
            className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
          >
            <Settings className="h-3 w-3" />
            Settings
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="w-full justify-start gap-3 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </aside>
  );
}
