import { Calendar, Link as LinkIcon, Tag, Settings, MessageSquare, MoreVertical, Plus, ArrowUp, Pencil, Grid3X3, Clock } from 'lucide-react';
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

export function ProjectDetailsView({ project }: ProjectDetailsViewProps) {
  const upvotes = project.upvotes ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero Header */}
      <Card className="overflow-hidden border-0 shadow-lg">
        {/* Background Header with color */}
        <div 
          className="relative h-40"
          style={{ backgroundColor: project.imageColor || 'hsl(210 80% 80%)' }}
        >
          {/* Created date badge */}
          <div className="absolute top-4 right-4 text-sm font-medium" style={{ color: 'hsl(210 30% 30%)' }}>
            Created on {format(project.createdAt, 'd MMM')}
          </div>
        </div>

        {/* Image placeholder */}
        <div className="relative px-6">
          <div 
            className="absolute -top-16 left-6 w-32 h-32 rounded-2xl flex items-center justify-center border-4 border-card shadow-xl"
            style={{ backgroundColor: project.imageColor ? `${project.imageColor.replace('85%', '90%')}` : 'hsl(210 80% 90%)' }}
          >
            <Grid3X3 className="h-12 w-12" style={{ color: 'hsl(210 30% 50%)' }} />
          </div>

          {/* Upvote badge */}
          <div className="absolute -top-5 left-40 flex items-center gap-1.5 bg-card border border-border rounded-full px-4 py-2 shadow-lg">
            <ArrowUp className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold text-foreground">{upvotes}</span>
          </div>

          {/* Edit button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-5 right-0 bg-card border border-border shadow-lg hover:bg-surface-hover"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        {/* Project Info */}
        <CardContent className="pt-20 pb-6 px-6">
          <div className="flex items-start gap-3 mb-4">
            <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
            {project.projectUrl && (
              <a
                href={`https://${project.projectUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkIcon className="h-4 w-4" />
                {project.projectUrl}
              </a>
            )}
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {project.description || 'No description provided.'}
          </p>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-sm text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Duration */}
          {project.duration && (
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Duration: {project.duration}</span>
            </div>
          )}
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
              {/* Add Role Card */}
              <Card className="border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[140px]">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Add Role</p>
                </CardContent>
              </Card>
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
