import { Calendar, User } from 'lucide-react';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const subtaskProgress = task.subtasks.length > 0
    ? `${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length}`
    : null;

  return (
    <div
      className={cn(
        "group rounded-lg border border-border bg-card p-3 cursor-pointer transition-all duration-200",
        "hover:border-primary/50 hover:shadow-md hover:shadow-primary/5"
      )}
      onClick={onClick}
    >
      <h4 className="font-medium text-foreground text-sm mb-2 leading-tight">
        {task.title}
      </h4>

      {/* Due date */}
      {task.dueDate && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Calendar className="h-3 w-3" />
          <span>{task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        {/* Subtasks progress */}
        <div className="flex items-center gap-2">
          {subtaskProgress && (
            <span className="text-xs text-muted-foreground">
              ✓ {subtaskProgress}
            </span>
          )}
        </div>

        {/* Assignees */}
        <div className="flex items-center">
          {task.assignees.length > 0 ? (
            <div className="flex -space-x-1.5">
              {task.assignees.slice(0, 2).map((assignee) => (
                <Avatar key={assignee.id} className="h-5 w-5 border border-card">
                  <AvatarImage src={assignee.avatar} alt={assignee.name} />
                  <AvatarFallback className="text-[10px]">
                    {assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 2 && (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground border border-card">
                  +{task.assignees.length - 2}
                </div>
              )}
            </div>
          ) : (
            <div className="h-5 w-5 rounded-full bg-muted/50 flex items-center justify-center border border-dashed border-border">
              <User className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
