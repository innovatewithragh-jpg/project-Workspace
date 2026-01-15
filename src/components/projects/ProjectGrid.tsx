import { useState, useMemo } from 'react';
import { Filter, SortAsc, Grid, Star } from 'lucide-react';
import { Project, ProjectStatus } from '@/types';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

type SortOption = 'updated' | 'name' | 'dueDate';
type FilterOption = 'all' | ProjectStatus;

export function ProjectGrid({ projects, onProjectClick }: ProjectGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const pinnedProjects = useMemo(() => 
    projects.filter(p => p.isPinned),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(p => !p.isPinned);
    
    if (filterBy !== 'all') {
      filtered = filtered.filter(p => p.status === filterBy);
    }
    
    switch (sortBy) {
      case 'name':
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case 'dueDate':
        return [...filtered].sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
      default:
        return [...filtered].sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
    }
  }, [projects, sortBy, filterBy]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {filterBy === 'all' ? 'All Projects' : filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setFilterBy('all')}>All Projects</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('active')}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('planning')}>Planning</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('paused')}>Paused</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('done')}>Done</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SortAsc className="h-4 w-4" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortBy('updated')}>Recently Updated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('dueDate')}>Due Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button variant="ghost" size="icon-sm">
          <Grid className="h-4 w-4" />
        </Button>
      </div>

      {/* Pinned section */}
      {pinnedProjects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-medium text-muted-foreground">Pinned</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onProjectClick?.(project)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All projects */}
      <div>
        {pinnedProjects.length > 0 && (
          <h2 className="text-sm font-medium text-muted-foreground mb-3">All Projects</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onProjectClick?.(project)}
            />
          ))}
        </div>
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
