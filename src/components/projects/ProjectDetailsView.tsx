import { Calendar, Link as LinkIcon, Tag, Settings, MessageSquare, MoreVertical } from 'lucide-react';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ProjectDetailsViewProps {
  project: Project;
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

export function ProjectDetailsView({ project }: ProjectDetailsViewProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
          <Badge variant={statusVariants[project.status]}>
            {statusLabels[project.status]}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created on {format(project.createdAt, 'MMMM d, yyyy')}</span>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {project.description || 'No description provided.'}
          </p>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.links && project.links.length > 0 ? (
            <div className="space-y-2">
              {project.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No links added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tags added.</p>
          )}
        </CardContent>
      </Card>

      {/* Project Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Project Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.roles && project.roles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.roles.map((roleData, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={roleData.user.avatar} />
                          <AvatarFallback>
                            {roleData.user.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{roleData.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {roleData.joinedAt ? `Joined ${format(roleData.joinedAt, 'MMM d')}` : 'Creator'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{roleData.role}</span>
                      </div>
                      {roleData.skills.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {roleData.skills.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.members.map((member, index) => (
                <Card key={member.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {index === 0 ? 'Creator' : 'Member'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {index === 0 ? 'Project Lead' : 'Team Member'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
