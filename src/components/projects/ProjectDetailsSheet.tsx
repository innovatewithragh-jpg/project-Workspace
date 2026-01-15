import { Calendar, Link as LinkIcon, Tag, Settings, MessageSquare, MoreVertical } from 'lucide-react';
import { Project } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ProjectDetailsSheetProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariants: Record<string, 'planning' | 'active' | 'paused' | 'done'> = {
  planning: 'planning',
  active: 'active',
  paused: 'paused',
  done: 'done',
};

const statusLabels: Record<string, string> = {
  planning: 'Planning',
  active: 'Active',
  paused: 'Paused',
  done: 'Done',
};

export function ProjectDetailsSheet({ project, open, onOpenChange }: ProjectDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3">
            <SheetTitle className="text-2xl">{project.title}</SheetTitle>
            <Badge variant={statusVariants[project.status]}>
              {statusLabels[project.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created on {format(project.createdAt, 'MMMM d, yyyy')}</span>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {project.description || 'No description provided.'}
            </p>
          </div>

          <Separator />

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Links
            </h3>
            {project.links && project.links.length > 0 ? (
              <div className="space-y-2">
                {project.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <LinkIcon className="h-3 w-3" />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No links added yet.</p>
            )}
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h3>
            {project.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags added.</p>
            )}
          </div>

          <Separator />

          {/* Project Roles */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Project Roles
            </h3>
            <div className="space-y-3">
              {project.roles && project.roles.length > 0 ? (
                project.roles.map((roleData, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={roleData.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {roleData.user.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{roleData.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {roleData.joinedAt ? `Joined ${format(roleData.joinedAt, 'MMM d')}` : 'Creator'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1 ml-10">
                        <div className="flex items-center gap-2">
                          <Settings className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{roleData.role}</span>
                        </div>
                        {roleData.skills.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {roleData.skills.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                project.members.map((member, index) => (
                  <Card key={member.id} className="border">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {index === 0 ? 'Creator' : 'Member'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="ml-10">
                        <div className="flex items-center gap-2">
                          <Settings className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {index === 0 ? 'Project Lead' : 'Team Member'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
