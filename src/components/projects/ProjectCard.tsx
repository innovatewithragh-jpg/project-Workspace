import { Calendar, Users, MoreHorizontal, MessageSquare, Plus, Star } from 'lucide-react';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onQuickChat?: () => void;
  onQuickTask?: () => void;
  onTogglePin?: () => void;
}

const statusVariants: Record<Project['status'], 'planning' | 'active' | 'paused' | 'done'> = {
  planning: 'planning',
  active: 'active',
  paused: 'paused',
  done: 'done',
};

const statusLabels: Record<Project['status'], string> = {
  planning: 'Planning',
  active: 'Active',
  paused: 'Paused',
  done: 'Done',
};

export function ProjectCard({
  project,
  onClick,
  onQuickChat,
  onQuickTask,
  onTogglePin,
}: ProjectCardProps) {
  const progressPercent = project.tasksTotal > 0 
    ? Math.round((project.tasksCompleted / project.tasksTotal) * 100) 
    : 0;

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-card p-4 transition-all duration-200 cursor-pointer",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
      )}
      onClick={onClick}
    >
      {/* Pin indicator */}
      {project.isPinned && (
        <div className="absolute -top-1 -right-1">
          <div className="h-5 w-5 rounded-full bg-warning flex items-center justify-center">
            <Star className="h-3 w-3 text-warning-foreground fill-current" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate mb-1">{project.title}</h3>
          {project.description && (
            <p className="text-xs text-muted-foreground truncate">{project.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Status & Due date */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={statusVariants[project.status]}>
          {statusLabels[project.status]}
        </Badge>
        {project.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{project.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium text-foreground">
            {project.tasksCompleted}/{project.tasksTotal}
          </span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Avatars */}
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-card">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          {project.members.length > 3 && (
            <span className="ml-2 text-xs text-muted-foreground flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              +{project.members.length - 3}
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onQuickTask?.();
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onQuickChat?.();
            }}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
