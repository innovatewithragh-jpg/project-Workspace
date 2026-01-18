import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-card">
      {/* Inner container with max-width and borders */}
      <div className="max-w-7xl mx-auto border-x border-border min-h-screen flex flex-col">
        {/* Top Bar */}
        <TopBar />
        
        {/* Content area with sidebar and main feed */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <Sidebar />
          
          {/* Center Feed */}
          <main className="flex-1 bg-muted overflow-y-auto scrollbar-hide">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
