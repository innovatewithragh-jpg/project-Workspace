import { useState } from 'react';
import { Plus, MoreHorizontal, Lightbulb, ListTodo, Loader2, FlaskConical, CheckCircle2 } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: TaskStatus) => void;
}

const columns: { id: TaskStatus; title: string; color: string; icon: React.ElementType }[] = [
  { id: 'idea', title: 'IDEA', color: 'bg-purple-500', icon: Lightbulb },
  { id: 'todo', title: 'TO DO', color: 'bg-status-planning', icon: ListTodo },
  { id: 'in_progress', title: 'IN PROGRESS', color: 'bg-info', icon: Loader2 },
  { id: 'testing', title: 'TESTING', color: 'bg-warning', icon: FlaskConical },
  { id: 'done', title: 'DONE', color: 'bg-status-active', icon: CheckCircle2 },
];

export function KanbanBoard({ tasks: initialTasks, onTaskClick, onAddTask }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const { toast } = useToast();

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask && draggedTask.status !== status) {
      const updatedTasks = tasks.map((task) =>
        task.id === draggedTask.id
          ? { ...task, status, updatedAt: new Date() }
          : task
      );
      setTasks(updatedTasks);
      
      const columnName = columns.find(col => col.id === status)?.title || status;
      toast({
        title: 'Task moved',
        description: `"${draggedTask.title}" moved to ${columnName}`,
      });
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleClearColumn = (status: TaskStatus) => {
    const updatedTasks = tasks.filter((task) => task.status !== status);
    setTasks(updatedTasks);
    
    const columnName = columns.find(col => col.id === status)?.title || status;
    toast({
      title: 'Column cleared',
      description: `All tasks in ${columnName} have been removed`,
    });
  };

  const handleMoveAllTasks = (fromStatus: TaskStatus, toStatus: TaskStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.status === fromStatus
        ? { ...task, status: toStatus, updatedAt: new Date() }
        : task
    );
    setTasks(updatedTasks);
    
    const fromName = columns.find(col => col.id === fromStatus)?.title || fromStatus;
    const toName = columns.find(col => col.id === toStatus)?.title || toStatus;
    toast({
      title: 'Tasks moved',
      description: `All tasks from ${fromName} moved to ${toName}`,
    });
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const Icon = column.icon;
        const isDropTarget = dragOverColumn === column.id && draggedTask?.status !== column.id;
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-72 flex flex-col"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", column.color)} />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {column.title}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {columnTasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onAddTask?.(column.id)}
                  title="Add task"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onAddTask?.(column.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add task
                    </DropdownMenuItem>
                    {column.id !== 'done' && (
                      <DropdownMenuItem onClick={() => handleMoveAllTasks(column.id, 'done')}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Move all to Done
                      </DropdownMenuItem>
                    )}
                    {columnTasks.length > 0 && (
                      <DropdownMenuItem 
                        onClick={() => handleClearColumn(column.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        Clear column
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Column content */}
            <div 
              className={cn(
                "flex-1 rounded-lg bg-surface-elevated/50 border border-border/50 p-2 min-h-[200px] transition-colors",
                isDropTarget && "border-primary bg-primary/5"
              )}
            >
              <ScrollArea className="h-full">
                <div className="space-y-2 pr-2">
                  {columnTasks.length === 0 && !isDropTarget && (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Icon className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-xs">No tasks yet</p>
                    </div>
                  )}
                  
                  {isDropTarget && columnTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-primary border-2 border-dashed border-primary/30 rounded-lg">
                      <Icon className="h-8 w-8 mb-2" />
                      <p className="text-xs font-medium">Drop here</p>
                    </div>
                  )}

                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "transition-all",
                        draggedTask?.id === task.id && "opacity-50 scale-95"
                      )}
                    >
                      <TaskCard task={task} onClick={() => onTaskClick?.(task)} />
                    </div>
                  ))}

                  {/* Add task button - placed under task cards */}
                  {columnTasks.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground mt-1"
                      onClick={() => onAddTask?.(column.id)}
                    >
                      <Plus className="h-4 w-4" />
                      Create Task
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        );
      })}
    </div>
  );
}
