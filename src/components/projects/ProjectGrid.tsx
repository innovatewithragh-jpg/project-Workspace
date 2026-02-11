import { useState, useMemo } from 'react';
import { Filter, SortAsc, Grid, Pin, Search } from 'lucide-react';
import { Project, ProjectStatus } from '@/types';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [mobileSearch, setMobileSearch] = useState('');

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
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-card/50 hover:bg-card border-border/50">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">
                {filterBy === 'all' ? 'All Projects' : filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-popover/95 backdrop-blur-xl border-border/50">
            <DropdownMenuItem onClick={() => setFilterBy('all')}>All Projects</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterBy('active')}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterBy('planning')}>Planning</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterBy('paused')}>Paused</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterBy('done')}>Done</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-card/50 hover:bg-card border-border/50">
              <SortAsc className="h-4 w-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-popover/95 backdrop-blur-xl border-border/50">
            <DropdownMenuItem onClick={() => setSortBy('updated')}>Recently Updated</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('dueDate')}>Due Date</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Search */}
        {isMobile && (
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              className="pl-8 h-8 text-sm bg-muted/50 border-border/50"
            />
          </div>
        )}
      </div>

      {/* Pinned section */}
      {pinnedProjects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Pin className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pinned</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {pinnedProjects.map((project, index) => (
              <div key={project.id} className="animate-enter" style={{ animationDelay: `${index * 50}ms` }}>
                <ProjectCard
                  project={project}
                  onClick={() => onProjectClick?.(project)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All projects */}
      <div>
        {pinnedProjects.length > 0 && (
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">All Projects</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className="animate-enter" style={{ animationDelay: `${index * 50}ms` }}>
              <ProjectCard
                project={project}
                onClick={() => onProjectClick?.(project)}
              />
            </div>
          ))}
        </div>
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-surface-hover mx-auto mb-4 flex items-center justify-center">
              <Grid className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">No projects match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
