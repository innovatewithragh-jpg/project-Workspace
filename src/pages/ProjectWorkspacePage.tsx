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
      <div className="min-h-screen bg-background">
        <TopBar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Project not found</h1>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go back home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <ProjectWorkspace project={project} onBack={() => navigate(`/project/${id}`)} />
    </div>
  );
};

export default ProjectWorkspacePage;
