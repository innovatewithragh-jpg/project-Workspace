import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen bg-card overflow-hidden">
      {/* Inner container with max-width and borders */}
      <div className="max-w-7xl mx-auto border-x border-border h-screen flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        
        {/* Center Feed - only scrollable area */}
        <main className="flex-1 bg-surface-feed overflow-y-auto scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
