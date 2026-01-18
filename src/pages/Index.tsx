import { TopBar } from '@/components/layout/TopBar';
import { UnifiedWorkspace } from '@/components/workspace/UnifiedWorkspace';

const Index = () => {
  return (
    <div className="h-screen bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto border-x border-border h-screen flex flex-col overflow-hidden">
        <TopBar />
        <UnifiedWorkspace />
      </div>
    </div>
  );
};

export default Index;
