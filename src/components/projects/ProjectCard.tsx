import { Calendar, Users, MoreHorizontal, Star, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onTogglePin?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
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
  onTogglePin,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const activeTasks = project.tasksTotal - project.tasksCompleted;
  const progressPercent = project.tasksTotal > 0 
    ? Math.round((project.tasksCompleted / project.tasksTotal) * 100) 
    : 0;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
        "hover:bg-card"
      )}
      onClick={onClick}
    >
      {/* Pin indicator */}
      {project.isPinned && (
        <div className="absolute -top-1.5 -right-1.5">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-warning to-warning/70 flex items-center justify-center shadow-lg shadow-warning/30">
            <Star className="h-3.5 w-3.5 text-warning-foreground fill-current" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate mb-1.5 text-base">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground truncate">{project.description}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2 hover:bg-surface-hover"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover z-50" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onTogglePin?.()}>
              <Star className="h-4 w-4 mr-2" />
              {project.isPinned ? 'Unpin project' : 'Pin project'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.()}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete?.()} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status & Due date */}
      <div className="flex items-center gap-2.5 mb-4">
        <Badge variant={statusVariants[project.status]} className="shadow-sm">
          {statusLabels[project.status]}
        </Badge>
        {project.dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface-hover/50 px-2 py-1 rounded-md">
            <Calendar className="h-3 w-3" />
            <span>{project.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>


      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        {/* Avatars */}
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-card ring-2 ring-background/50">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          {project.members.length > 3 && (
            <span className="ml-2 text-xs text-muted-foreground flex items-center gap-1 bg-surface-hover/50 px-2 py-0.5 rounded-full">
              <Users className="h-3 w-3" />
              +{project.members.length - 3}
            </span>
          )}
        </div>

        {/* Active Tasks */}
        <div className="text-xs text-muted-foreground">
          {activeTasks} active
        </div>
      </div>
    </div>
  );
}
