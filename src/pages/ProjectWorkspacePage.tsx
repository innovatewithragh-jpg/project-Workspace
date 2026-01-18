import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { ProjectWorkspace } from '@/components/workspace/ProjectWorkspace';
import { projects } from '@/data/mockData';
import { Button } from '@/components/ui/button';

const ProjectWorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="h-screen bg-card overflow-hidden">
        <div className="max-w-7xl mx-auto border-x border-border h-screen flex flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">Project not found</h1>
              <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/')}>Go back home</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto border-x border-border h-screen flex flex-col overflow-hidden">
        <TopBar />
        <ProjectWorkspace project={project} onBack={() => navigate('/')} />
      </div>
    </div>
  );
};

export default ProjectWorkspacePage;
