import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { X, Calendar, Tag, Paperclip, User, Check, ChevronDown, Plus, Send } from 'lucide-react';
import { Task, User as UserType, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { users } from '@/data/mockData';

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  idea: 'Idea',
  todo: 'To Do',
  in_progress: 'In Progress',
  testing: 'Testing',
  done: 'Done',
};

export function TaskModal({ task, open, onOpenChange }: TaskModalProps) {
  const [newComment, setNewComment] = useState('');

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <DialogTitle className="text-xl font-semibold text-foreground mb-2">
                  {task.title}
                </DialogTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Created by {task.createdBy.name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(task.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Main content */}
            <div className="flex-1 overflow-auto">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Subtasks */}
                  {task.subtasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                      </h4>
                      <div className="space-y-2">
                        {task.subtasks.map((subtask) => (
                          <div
                            key={subtask.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-surface-elevated border border-border"
                          >
                            <Checkbox checked={subtask.completed} />
                            <span className={subtask.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Comments</h4>
                    {task.comments.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {task.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.author.avatar} />
                              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground">
                                  {comment.author.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm text-foreground">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-4">No comments yet.</p>
                    )}
                    
                    {/* Add comment */}
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={users[0].avatar} />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                        <Button size="icon" className="self-end">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Sidebar */}
            <div className="w-64 border-l border-border bg-surface-elevated/50 p-4 overflow-auto">
              <div className="space-y-5">
                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Status
                  </label>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    {statusLabels[task.status]}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Assignees */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Assignees
                  </label>
                  <div className="space-y-2">
                    {task.assignees.map((assignee) => (
                      <div key={assignee.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatar} />
                          <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{assignee.name}</span>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
                      <Plus className="h-4 w-4" />
                      Add assignee
                    </Button>
                  </div>
                </div>

                {/* Due date */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Due Date
                  </label>
                  {task.dueDate ? (
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Set due date
                    </Button>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-muted-foreground">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Attachments
                  </label>
                  {task.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {task.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 text-sm">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
                      <Paperclip className="h-4 w-4" />
                      Add attachment
                    </Button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-4 border-t border-border space-y-2">
                <Button variant="glow" className="w-full gap-2">
                  <Check className="h-4 w-4" />
                  Mark as Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
