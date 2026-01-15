import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ProjectWorkspace } from '@/components/workspace/ProjectWorkspace';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { projects, activityFeed } from '@/data/mockData';
import { Project } from '@/types';

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToHome = () => {
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      {selectedProject ? (
        <ProjectWorkspace project={selectedProject} onBack={handleBackToHome} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-1">Projects</h1>
                <p className="text-muted-foreground">
                  Manage your team's projects and tasks in one place
                </p>
              </div>
              <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />
            </div>

            {/* Activity sidebar */}
            <aside className="hidden xl:block w-80 flex-shrink-0">
              <ActivityFeed activities={activityFeed} />
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
