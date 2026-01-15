import { useState } from 'react';
import { Plus, MoreHorizontal, Settings2 } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: TaskStatus) => void;
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'idea', title: 'IDEA', color: 'bg-purple-500' },
  { id: 'todo', title: 'TO DO', color: 'bg-status-planning' },
  { id: 'in_progress', title: 'IN PROGRESS', color: 'bg-info' },
  { id: 'testing', title: 'TESTING', color: 'bg-warning' },
  { id: 'done', title: 'DONE', color: 'bg-status-active' },
];

export function KanbanBoard({ tasks, onTaskClick, onAddTask }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask && draggedTask.status !== status) {
      // In a real app, this would update the task status
      console.log(`Moving task ${draggedTask.id} to ${status}`);
    }
    setDraggedTask(null);
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-72 flex flex-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", column.color)} />
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
                  className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Column content */}
            <div className="flex-1 rounded-lg bg-surface-elevated/50 border border-border/50 p-2 min-h-[200px]">
              <ScrollArea className="h-full">
                <div className="space-y-2 pr-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "transition-opacity",
                        draggedTask?.id === task.id && "opacity-50"
                      )}
                    >
                      <TaskCard task={task} onClick={() => onTaskClick?.(task)} />
                    </div>
                  ))}

                  {/* Add task button - placed under task cards */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => onAddTask?.(column.id)}
                  >
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              </ScrollArea>
            </div>
          </div>
        );
      })}
    </div>
  );
}
