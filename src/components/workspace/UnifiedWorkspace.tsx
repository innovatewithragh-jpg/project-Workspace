import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  LayoutGrid,
  ListTodo,
  MessageSquare,
  Folder,
  Settings,
  Users,
  Box,
  Home,
  User,
  FolderOpen,
  Pencil,
  Check,
  X,
  Plus,
  Menu,
  Sun,
  Moon,
  RefreshCw,
} from 'lucide-react';
import { Project, Task, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { MyTasksList } from '@/components/tasks/MyTasksList';
import { FilesSection } from '@/components/files/FilesSection';
import { TaskModal } from '@/components/tasks/TaskModal';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { ProjectChat } from '@/components/chat/ProjectChat';
import { ProjectDetailsView } from '@/components/projects/ProjectDetailsView';
import { SettingsView } from '@/components/settings/SettingsView';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { tasks as mockTasks, chatMessages, projects } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/use-theme';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ViewType = 'projects' | 'project' | 'board' | 'list' | 'chat' | 'files' | 'settings';

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

// Dummy team members for when no project is selected
const dummyTeamMembers = [
  { id: 'dummy1', name: 'Team Member', avatar: '' },
  { id: 'dummy2', name: 'Team Member', avatar: '' },
  { id: 'dummy3', name: 'Team Member', avatar: '' },
];

export function UnifiedWorkspace() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState<ViewType>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>('todo');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [quote, setQuote] = useState(() => {
    const savedQuote = localStorage.getItem('workspace-quote');
    return savedQuote || '"The only way to do great work is to love what you do."';
  });
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [editQuoteValue, setEditQuoteValue] = useState(quote);
  const quoteInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isEditingQuote && quoteInputRef.current) {
      quoteInputRef.current.focus();
      quoteInputRef.current.select();
    }
  }, [isEditingQuote]);

  const handleStartEditQuote = () => {
    setEditQuoteValue(quote);
    setIsEditingQuote(true);
  };

  const handleSaveQuote = () => {
    if (editQuoteValue.trim()) {
      const newQuote = editQuoteValue.trim();
      setQuote(newQuote);
      localStorage.setItem('workspace-quote', newQuote);
      toast({
        title: 'Quote updated',
        description: 'Your workspace quote has been saved.',
      });
    }
    setIsEditingQuote(false);
  };

  const handleCancelEditQuote = () => {
    setEditQuoteValue(quote);
    setIsEditingQuote(false);
  };

  const handleQuoteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveQuote();
    } else if (e.key === 'Escape') {
      handleCancelEditQuote();
    }
  };

  const projectTasks = selectedProject 
    ? mockTasks.filter((t) => t.projectId === selectedProject.id)
    : [];

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
    console.log('Creating task:', taskData);
    toast({
      title: 'Task created',
      description: `"${taskData.title}" has been added to ${taskData.status.replace('_', ' ')}.`,
    });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setActiveView('project');
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setActiveView('projects');
  };

  const isProjectSelected = selectedProject !== null;

  const navItems: { id: ViewType; icon: typeof LayoutGrid; label: string; requiresProject: boolean }[] = [
    { id: 'project', icon: Box, label: 'Project', requiresProject: false },
    { id: 'board', icon: LayoutGrid, label: 'Task Board', requiresProject: true },
    { id: 'list', icon: ListTodo, label: 'My Tasks', requiresProject: true },
    { id: 'chat', icon: MessageSquare, label: 'Group Chat', requiresProject: true },
    { id: 'files', icon: Folder, label: 'Files', requiresProject: true },
    { id: 'settings', icon: Settings, label: 'Settings', requiresProject: true },
  ];

  const getHeaderTitle = () => {
    if (activeView === 'projects') return 'Projects';
    return navItems.find((n) => n.id === activeView)?.label || 'Project';
  };

  // Sidebar content component to reuse in both desktop and mobile
  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      {/* Header section - only show when project is selected */}
      {isProjectSelected && (
        <div className="h-12 flex items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 -ml-2"
            onClick={() => {
              handleBackToProjects();
              onNavClick?.();
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}

      {/* Project info or quote */}
      <div className="px-4 py-2.5 border-b border-border">
        {isProjectSelected ? (
          <>
            <h2 className="font-semibold text-foreground truncate">
              {selectedProject.title}
            </h2>
            <Badge variant={statusVariants[selectedProject.status]} className="mt-2">
              {statusLabels[selectedProject.status]}
            </Badge>
          </>
        ) : (
          <div className="group relative">
            {isEditingQuote ? (
              <div className="flex flex-col gap-2">
                <Input
                  ref={quoteInputRef}
                  value={editQuoteValue}
                  onChange={(e) => setEditQuoteValue(e.target.value)}
                  onKeyDown={handleQuoteKeyDown}
                  className="text-xs h-8"
                  placeholder="Enter your quote..."
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleSaveQuote}
                    className="h-6 w-6 text-success hover:text-success"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleCancelEditQuote}
                    className="h-6 w-6 text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative bg-primary/5 rounded-lg p-3 border-l-2 border-primary/30">
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  <span className="text-primary/40 text-lg leading-none mr-1">"</span>
                  {quote.replace(/^"|"$/g, '')}
                  <span className="text-primary/40 text-lg leading-none ml-1">"</span>
                </p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleStartEditQuote}
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 absolute top-1 right-1"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 flex flex-col">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id || (activeView === 'projects' && item.id === 'project');
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'project' && !isProjectSelected) {
                    setActiveView('projects');
                  } else {
                    setActiveView(item.id);
                  }
                  onNavClick?.();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.id === 'chat' && isProjectSelected && (
                  <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    3
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Back to Home & Dark Mode */}
        <div className="mt-auto pt-8 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-3 border-border/50 bg-surface-hover/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            onClick={() => {
              navigate('/');
              onNavClick?.();
            }}
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
            onClick={toggleTheme}
          >
            <span className="flex items-center gap-3">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
            <RefreshCw className="h-4 w-4" />
          </Button>
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
        <div className="space-y-3">
          {isProjectSelected ? (
            <>
              {selectedProject.members.slice(0, 4).map((member) => (
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
              {selectedProject.members.length > 4 && (
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                  +{selectedProject.members.length - 4} more
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-muted-foreground mb-3">
                Find the Right People.<br />Build Together.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Users className="h-4 w-4" />
                Find Teammates
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-1 overflow-hidden animate-fade-in">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 border-r border-border bg-surface flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Bottom Navigation - REMOVED */}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header with breadcrumb */}
        <header className="h-14 md:h-16 border-b border-border flex items-center justify-between px-3 md:px-4">
          {/* Mobile hamburger menu */}
          <div className="flex items-center gap-2">
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-surface">
                <div className="flex flex-col h-full">
                  <SidebarContent onNavClick={() => setIsMobileSidebarOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            
            <nav className="flex items-center gap-1.5 md:gap-2 text-sm md:text-sm">
              <span className="text-muted-foreground hidden sm:inline">My Workspace</span>
              <span className="text-muted-foreground hidden sm:inline">/</span>
              <span className="font-medium text-foreground text-base md:text-sm">{getHeaderTitle()}</span>
            </nav>
          </div>
          
          {/* Create Project Button */}
          {activeView === 'projects' && (
            <Button 
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="gap-2"
              size={isMobile ? "sm" : "default"}
            >
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </Button>
          )}
        </header>

        {/* Content - add bottom padding for mobile nav */}
        <div className="flex-1 overflow-auto scrollbar-hide p-3 md:p-4">
          {activeView === 'projects' && (
            <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />
          )}
          {activeView === 'project' && selectedProject && (
            <ProjectDetailsView project={selectedProject} />
          )}
          {activeView === 'board' && (
            selectedProject ? (
              <KanbanBoard tasks={projectTasks} onTaskClick={handleTaskClick} onAddTask={handleAddTask} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <LayoutGrid className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Your Task Board Awaits!</h3>
                <p className="text-muted-foreground max-w-sm">Organize, prioritize, and conquer your tasks with our intuitive kanban board. Pick a project to get started! 🚀</p>
              </div>
            )
          )}
          {activeView === 'list' && (
            selectedProject ? (
              <MyTasksList 
                tasks={mockTasks} 
                projects={projects} 
                onTaskClick={handleTaskClick} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <ListTodo className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Check Things Off?</h3>
                <p className="text-muted-foreground max-w-sm">Your personal task list is waiting to help you stay on top of everything. Choose a project and let's get productive! ✨</p>
              </div>
            )
          )}
          {activeView === 'chat' && (
            selectedProject ? (
              <div className="h-full -m-4">
                <ProjectChat messages={chatMessages.filter((m) => m.projectId === selectedProject.id)} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Great Ideas Start with Conversations</h3>
                <p className="text-muted-foreground max-w-sm">Connect with your team, share updates, and brainstorm together. Jump into a project to start chatting! 💬</p>
              </div>
            )
          )}
          {activeView === 'files' && (
            selectedProject ? (
              <FilesSection />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <FolderOpen className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">All Your Files, One Place</h3>
                <p className="text-muted-foreground max-w-sm">Documents, designs, and resources—everything you need, perfectly organized. Open a project to explore! 📁</p>
              </div>
            )
          )}
          {activeView === 'settings' && (
            selectedProject ? (
              <SettingsView project={selectedProject} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Settings className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Customize Your Experience</h3>
                <p className="text-muted-foreground max-w-sm">Fine-tune notifications, permissions, and preferences to work your way. Select a project to customize! ⚙️</p>
              </div>
            )
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

      {/* Create project modal */}
      <CreateProjectModal
        open={isCreateProjectModalOpen}
        onOpenChange={setIsCreateProjectModalOpen}
        onCreateProject={(projectData) => {
          console.log('Creating project:', projectData);
          toast({
            title: 'Project created',
            description: `"${projectData.title}" has been created successfully.`,
          });
        }}
      />
    </div>
  );
}
