import { useState } from 'react';
import {
  ArrowLeft,
  LayoutGrid,
  ListTodo,
  MessageSquare,
  Folder,
  Settings,
  Users,
  Info,
} from 'lucide-react';
import { Project, Task, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { MyTasksList } from '@/components/tasks/MyTasksList';
import { FilesSection } from '@/components/files/FilesSection';
import { TaskModal } from '@/components/tasks/TaskModal';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { ProjectChat } from '@/components/chat/ProjectChat';
import { ProjectDetailsView } from '@/components/projects/ProjectDetailsView';
import { tasks as mockTasks, chatMessages, projects } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProjectWorkspaceProps {
  project: Project;
  onBack: () => void;
}

type ViewType = 'board' | 'list' | 'chat' | 'files' | 'settings' | 'project';

const statusLabels: Record<Project['status'], string> = {
  planning: 'Planning',
  active: 'Active',
  paused: 'Paused',
  done: 'Done',
};

const statusVariants: Record<Project['status'], 'planning' | 'active' | 'paused' | 'done'> = {
  planning: 'planning',
  active: 'active',
  paused: 'paused',
  done: 'done',
};

export function ProjectWorkspace({ project, onBack }: ProjectWorkspaceProps) {
  const [activeView, setActiveView] = useState<ViewType>('board');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>('todo');
  const { toast } = useToast();

  const projectTasks = mockTasks.filter((t) => t.projectId === project.id);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = (status: TaskStatus) => {
    setCreateTaskStatus(status);
    setIsCreateTaskModalOpen(true);
  };

  const handleCreateTask = (taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    assignees: any[];
    dueDate?: Date;
    tags: string[];
  }) => {
    // In a real app, this would save to the database
    console.log('Creating task:', taskData);
    toast({
      title: 'Task created',
      description: `"${taskData.title}" has been added to ${taskData.status.replace('_', ' ')}.`,
    });
  };

  const navItems: { id: ViewType; icon: typeof LayoutGrid; label: string }[] = [
    { id: 'project', icon: Info, label: 'Project' },
    { id: 'board', icon: LayoutGrid, label: 'Board' },
    { id: 'list', icon: ListTodo, label: 'My Tasks' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'files', icon: Folder, label: 'Files' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] animate-fade-in">
      {/* Left rail */}
      <aside className="w-56 border-r border-border bg-surface flex flex-col">
        {/* Back button & project info */}
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-3 -ml-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button 
            variant="ghost"
            className="w-full font-semibold text-foreground text-left truncate px-3 py-2 h-auto hover:bg-surface-hover justify-start"
            onClick={() => setActiveView('project')}
          >
            {project.title}
          </Button>
          <Badge variant={statusVariants[project.status]} className="mt-2 ml-3">
            {statusLabels[project.status]}
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  activeView === item.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.id === 'chat' && (
                  <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    3
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Team members */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Team
            </span>
            <Button variant="ghost" size="icon-sm">
              <Users className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {project.members.slice(0, 4).map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <div className="relative">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-success border-2 border-surface" />
                  )}
                </div>
                <span className="text-sm text-foreground truncate">{member.name}</span>
              </div>
            ))}
            {project.members.length > 4 && (
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                +{project.members.length - 4} more
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-12 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-foreground">
              {navItems.find((n) => n.id === activeView)?.label}
            </h3>
          </div>
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeView === 'project' && <ProjectDetailsView project={project} />}
          {activeView === 'board' && (
            <KanbanBoard tasks={projectTasks} onTaskClick={handleTaskClick} onAddTask={handleAddTask} />
          )}
          {activeView === 'list' && (
            <MyTasksList 
              tasks={mockTasks} 
              projects={projects} 
              onTaskClick={handleTaskClick} 
            />
          )}
          {activeView === 'chat' && (
            <div className="h-full -m-4">
              <ProjectChat messages={chatMessages.filter((m) => m.projectId === project.id)} />
            </div>
          )}
          {activeView === 'files' && <FilesSection />}
          {activeView === 'settings' && (
            <div className="text-center py-12 text-muted-foreground">
              Settings coming soon
            </div>
          )}
        </div>
      </main>

      {/* Task modal */}
      <TaskModal
        task={selectedTask}
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
      />

      {/* Create task modal */}
      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onOpenChange={setIsCreateTaskModalOpen}
        initialStatus={createTaskStatus}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}
