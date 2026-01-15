import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X, Plus } from 'lucide-react';
import { TaskStatus, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { users } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStatus?: TaskStatus;
  onCreateTask?: (task: {
    title: string;
    description: string;
    status: TaskStatus;
    assignees: User[];
    dueDate?: Date;
    tags: string[];
  }) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'idea', label: 'Idea' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'testing', label: 'Testing' },
  { value: 'done', label: 'Done' },
];

const tagSuggestions = ['design', 'development', 'research', 'marketing', 'priority', 'bug'];

export function CreateTaskModal({
  open,
  onOpenChange,
  initialStatus = 'todo',
  onCreateTask,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleAddAssignee = (user: User) => {
    if (!selectedAssignees.find((a) => a.id === user.id)) {
      setSelectedAssignees([...selectedAssignees, user]);
    }
  };

  const handleRemoveAssignee = (userId: string) => {
    setSelectedAssignees(selectedAssignees.filter((a) => a.id !== userId));
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 3) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreateTask?.({
      title: title.trim(),
      description: description.trim(),
      status,
      assignees: selectedAssignees,
      dueDate,
      tags,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setStatus(initialStatus);
    setSelectedAssignees([]);
    setDueDate(undefined);
    setTags([]);
    onOpenChange(false);
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus(initialStatus);
    setSelectedAssignees([]);
    setDueDate(undefined);
    setTags([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <Label>Assignees</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedAssignees.map((user) => (
                <Badge key={user.id} variant="secondary" className="gap-1 pr-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-[8px]">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.name}
                  <button
                    onClick={() => handleRemoveAssignee(user.id)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Select onValueChange={(val) => handleAddAssignee(users.find((u) => u.id === val)!)}>
              <SelectTrigger>
                <SelectValue placeholder="Add assignee..." />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((u) => !selectedAssignees.find((a) => a.id === u.id))
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-[10px]">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (max 3)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1 pr-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {tags.length < 3 && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(newTag);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleAddTag(newTag)}
                  disabled={!newTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            {tags.length < 3 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tagSuggestions
                  .filter((t) => !tags.includes(t))
                  .slice(0, 4)
                  .map((tag) => (
                    <Button
                      key={tag}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground"
                      onClick={() => handleAddTag(tag)}
                    >
                      + {tag}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
