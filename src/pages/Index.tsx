import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { projects } from '@/data/mockData';
import { Project } from '@/types';

const Index = () => {
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}/workspace`);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-base">
            Manage your team's projects and tasks in one place
          </p>
        </div>
        <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />
      </div>
    </MainLayout>
  );
};

export default Index;
