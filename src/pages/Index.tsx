import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { projects, activityFeed } from '@/data/mockData';
import { Project } from '@/types';

const Index = () => {
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}/workspace`);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Projects</h1>
              <p className="text-muted-foreground text-base">
                Manage your team's projects and tasks in one place
              </p>
            </div>
            <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />
          </div>

          {/* Activity sidebar */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <ActivityFeed activities={activityFeed} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;
