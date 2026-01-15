import { useMemo } from 'react';
import { format, isToday, isTomorrow, isPast, isThisWeek, addDays } from 'date-fns';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Task, Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MyTasksListProps {
  tasks: Task[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
}

const statusLabels: Record<Task['status'], string> = {
  idea: 'Idea',
  todo: 'To Do',
  in_progress: 'In Progress',
  testing: 'Testing',
  done: 'Done',
};

const statusColors: Record<Task['status'], string> = {
  idea: 'bg-muted text-muted-foreground',
  todo: 'bg-primary/10 text-primary',
  in_progress: 'bg-warning/10 text-warning',
  testing: 'bg-info/10 text-info',
  done: 'bg-success/10 text-success',
};

function getDeadlineLabel(date: Date | undefined): string {
  if (!date) return 'No deadline';
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isPast(date)) return 'Overdue';
  if (isThisWeek(date)) return 'This Week';
  return 'Later';
}

function getDeadlineOrder(date: Date | undefined): number {
  if (!date) return 5;
  if (isPast(date) && !isToday(date)) return 0;
  if (isToday(date)) return 1;
  if (isTomorrow(date)) return 2;
  if (isThisWeek(date)) return 3;
  return 4;
}

export function MyTasksList({ tasks, projects, onTaskClick }: MyTasksListProps) {
  const projectMap = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc[project.id] = project;
      return acc;
    }, {} as Record<string, Project>);
  }, [projects]);

  // Group tasks by deadline category, then by project
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Record<string, Task[]>> = {};
    
    const sortedTasks = [...tasks].sort((a, b) => {
      const orderA = getDeadlineOrder(a.dueDate);
      const orderB = getDeadlineOrder(b.dueDate);
      if (orderA !== orderB) return orderA - orderB;
      
      // Secondary sort by date within same category
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    });

    sortedTasks.forEach((task) => {
      const deadlineLabel = getDeadlineLabel(task.dueDate);
      const projectTitle = projectMap[task.projectId]?.title || 'Unknown Project';
      
      if (!groups[deadlineLabel]) {
        groups[deadlineLabel] = {};
      }
      if (!groups[deadlineLabel][projectTitle]) {
        groups[deadlineLabel][projectTitle] = [];
      }
      groups[deadlineLabel][projectTitle].push(task);
    });

    return groups;
  }, [tasks, projectMap]);

  const deadlineOrder = ['Overdue', 'Today', 'Tomorrow', 'This Week', 'Later', 'No deadline'];

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No tasks assigned to you
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {deadlineOrder.map((deadlineLabel) => {
        const projectGroups = groupedTasks[deadlineLabel];
        if (!projectGroups) return null;

        const isOverdue = deadlineLabel === 'Overdue';
        const isToday = deadlineLabel === 'Today';

        return (
          <div key={deadlineLabel}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className={cn(
                "h-4 w-4",
                isOverdue ? "text-destructive" : isToday ? "text-warning" : "text-muted-foreground"
              )} />
              <h3 className={cn(
                "font-semibold text-sm uppercase tracking-wide",
                isOverdue ? "text-destructive" : isToday ? "text-warning" : "text-muted-foreground"
              )}>
                {deadlineLabel}
              </h3>
            </div>

            <div className="space-y-4">
              {Object.entries(projectGroups).map(([projectTitle, projectTasks]) => {
                const project = projects.find(p => p.title === projectTitle);
                
                return (
                  <div key={projectTitle} className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
                      <div 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: project?.status === 'active' ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))' }}
                      />
                      <span className="text-sm font-medium text-foreground">{projectTitle}</span>
                      <span className="text-xs text-muted-foreground">({projectTasks.length} tasks)</span>
                    </div>

                    <div className="divide-y divide-border">
                      {projectTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className="w-full px-4 py-3 flex items-center gap-4 hover:bg-surface-hover transition-colors text-left group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn(
                                "font-medium text-foreground group-hover:text-primary transition-colors",
                                task.status === 'done' && "line-through text-muted-foreground"
                              )}>
                                {task.title}
                              </span>
                              <Badge className={cn("text-xs", statusColors[task.status])}>
                                {statusLabels[task.status]}
                              </Badge>
                            </div>
                            
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span className={cn(
                                  isPast(task.dueDate) && !isToday && task.status !== 'done' && "text-destructive"
                                )}>
                                  {format(task.dueDate, 'MMM d, yyyy')}
                                </span>
                              </div>
                            )}
                          </div>

                          {task.tags.length > 0 && (
                            <div className="hidden sm:flex items-center gap-1">
                              {task.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex -space-x-1">
                            {task.assignees.slice(0, 2).map((assignee) => (
                              <Avatar key={assignee.id} className="h-6 w-6 border-2 border-card">
                                <AvatarImage src={assignee.avatar} />
                                <AvatarFallback className="text-[10px]">
                                  {assignee.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>

                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
