import { useState } from 'react';
import { ArrowUp, MoreHorizontal, Pin, Pencil, Trash2, Layers, Palette, Briefcase, Code } from 'lucide-react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onTogglePin?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Different project icons based on category
const getProjectIcon = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'ai/ml':
    case 'saas':
      return Code;
    case 'ux':
    case 'marketing':
      return Palette;
    case 'fintech':
    case 'e-commerce':
      return Briefcase;
    default:
      return Layers;
  }
};

// Sample member avatars for display
const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
];

export function ProjectCard({
  project,
  onClick,
  onTogglePin,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [upvotes, setUpvotes] = useState(project.upvotes ?? 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasUpvoted) {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
    }
  };

  const ProjectIcon = getProjectIcon(project.category || project.tags[0]);

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border/50 bg-card overflow-hidden cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
      )}
      onClick={onClick}
    >
      {/* Image Section */}
      <div 
        className="relative h-32 flex items-center justify-center"
        style={{ backgroundColor: project.imageColor || 'hsl(340 70% 85%)' }}
      >
        {/* Project Icon - Left Upper Corner */}
        <div className="absolute top-3 left-3 z-10">
          <div 
            className="h-16 w-16 rounded-xl bg-card/30 backdrop-blur-sm flex items-center justify-center border border-card/20 shadow-lg"
          >
            <ProjectIcon className="h-8 w-8 text-card/90" />
          </div>
        </div>

        {/* Pin indicator */}
        {project.isPinned && (
          <div className="absolute top-3 left-20 z-10">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-warning to-warning/70 flex items-center justify-center shadow-lg shadow-warning/30">
              <Pin className="h-3.5 w-3.5 text-warning-foreground fill-current" />
            </div>
          </div>
        )}

        {/* Team Member Avatars - Right Upper Corner */}
        <div className="absolute top-3 right-3 z-10 flex -space-x-2">
          {project.members.slice(0, 3).map((member, index) => (
            <Avatar key={member.id} className="h-8 w-8 border-2 border-card/50 shadow-md">
              <AvatarImage src={member.avatar || SAMPLE_AVATARS[index % SAMPLE_AVATARS.length]} />
              <AvatarFallback className="text-xs bg-primary/20">{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {project.members.length > 3 && (
            <div className="h-8 w-8 rounded-full bg-primary/80 border-2 border-card/50 flex items-center justify-center shadow-md">
              <span className="text-xs font-medium text-primary-foreground">+{project.members.length - 3}</span>
            </div>
          )}
        </div>

        {/* Upvote badge - Enhanced */}
        <button
          onClick={handleUpvote}
          className={cn(
            "absolute bottom-0 right-4 translate-y-1/2 flex items-center gap-1.5 bg-card border rounded-full px-3 py-1.5 shadow-lg transition-all duration-200 hover:scale-105",
            hasUpvoted 
              ? "border-primary/50 bg-primary/5" 
              : "border-border hover:border-primary/30"
          )}
        >
          <div className={cn(
            "h-6 w-6 rounded-full flex items-center justify-center transition-colors",
            hasUpvoted ? "bg-primary/10" : "bg-muted/50"
          )}>
            <ArrowUp className={cn(
              "h-4 w-4 transition-colors",
              hasUpvoted ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <span className={cn(
            "text-sm font-medium transition-colors",
            hasUpvoted ? "text-primary" : "text-foreground"
          )}>{upvotes}</span>
        </button>

        {/* Dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-card/50 backdrop-blur-sm hover:bg-card/80"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-popover z-50" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onTogglePin?.()}>
              <Pin className="h-4 w-4 mr-2" />
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

      {/* Content */}
      <div className="p-4 pt-6">
        {/* Title */}
        <h3 className="font-semibold text-foreground text-base mb-2">{project.title}</h3>
        
        {/* Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {project.description}
          </p>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground mb-0.5">Created</p>
            <p className="font-medium text-foreground">
              {format(project.createdAt, 'M/d/yy')}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Category</p>
            <p className="font-medium text-foreground">
              {project.category || project.tags[0] || 'General'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Phase</p>
            <p className="font-medium text-foreground">
              {project.phase || 'MVP'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
