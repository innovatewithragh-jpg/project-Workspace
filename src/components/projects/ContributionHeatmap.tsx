import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectRole, User } from '@/types';
import { format, subDays, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { Activity } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ContributionHeatmapProps {
  roles?: ProjectRole[];
  members: User[];
}

interface DayContribution {
  date: Date;
  contributors: { user: User; role: string }[];
}

// Generate mock contribution data with contributor info
const generateContributionsWithContributors = (
  teammates: { user: User; role: string }[]
) => {
  const contributions: DayContribution[] = [];
  const today = new Date();
  
  // Generate data for the last 20 weeks (140 days)
  for (let i = 0; i < 140; i++) {
    const date = subDays(today, i);
    
    // Randomly select which teammates contributed on this day
    const dayContributors: { user: User; role: string }[] = [];
    teammates.forEach(teammate => {
      const random = Math.random();
      if (random > 0.6) {
        dayContributors.push(teammate);
      }
    });
    
    contributions.push({ date, contributors: dayContributors });
  }
  
  return contributions;
};

const getContributionLevel = (count: number): string => {
  if (count === 0) return 'bg-muted/50';
  if (count === 1) return 'bg-primary/25';
  if (count === 2) return 'bg-primary/50';
  if (count === 3) return 'bg-primary/75';
  return 'bg-primary';
};

export function ContributionHeatmap({ roles, members }: ContributionHeatmapProps) {
  // Get teammates from roles or fallback to members
  const teammates = useMemo(() => {
    if (roles && roles.length > 0) {
      return roles.map(r => ({ user: r.user, role: r.role }));
    }
    return members.map((m, i) => ({ 
      user: m, 
      role: i === 0 ? 'Project Lead' : 'Team Member' 
    }));
  }, [roles, members]);

  // Generate contributions with contributor info
  const contributions = useMemo(() => {
    return generateContributionsWithContributors(teammates);
  }, [teammates]);

  const getContributionForDay = (date: Date): DayContribution | undefined => {
    return contributions.find(c => isSameDay(c.date, date));
  };

  // Generate weeks for the grid (20 weeks)
  const weeks = useMemo(() => {
    const today = new Date();
    const endDate = today;
    const startDate = subDays(today, 139); // 20 weeks = 140 days
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Group days by week
    const weekGroups: Date[][] = [];
    let currentWeek: Date[] = [];
    
    days.forEach((day, index) => {
      const dayOfWeek = day.getDay();
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      if (index === days.length - 1) {
        weekGroups.push(currentWeek);
      }
    });
    
    return weekGroups;
  }, []);

  // Generate month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = '';
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0];
      const month = format(firstDayOfWeek, 'MMM');
      
      if (month !== lastMonth) {
        labels.push({ month, weekIndex });
        lastMonth = month;
      }
    });
    
    return labels;
  }, [weeks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Team Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-3">
            {/* Heatmap grid */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-max">
                {/* Month labels */}
                <div className="relative h-5 mb-1 ml-6">
                  {monthLabels.map(({ month, weekIndex }) => (
                    <span 
                      key={`${month}-${weekIndex}`}
                      className="absolute text-xs text-muted-foreground"
                      style={{ left: `${weekIndex * 12}px` }}
                    >
                      {month}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-[2px]">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[2px] text-[10px] text-muted-foreground pr-1 w-4">
                    <span className="h-[10px] leading-[10px]">S</span>
                    <span className="h-[10px] leading-[10px]">M</span>
                    <span className="h-[10px] leading-[10px]">T</span>
                    <span className="h-[10px] leading-[10px]">W</span>
                    <span className="h-[10px] leading-[10px]">T</span>
                    <span className="h-[10px] leading-[10px]">F</span>
                    <span className="h-[10px] leading-[10px]">S</span>
                  </div>
                  
                  {/* Grid */}
                  <div className="flex gap-[2px]">
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-[2px]">
                        {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                          const day = week.find(d => d.getDay() === dayOfWeek);
                          
                          if (!day) {
                            return (
                              <div 
                                key={dayOfWeek} 
                                className="w-[10px] h-[10px] rounded-[2px]" 
                              />
                            );
                          }
                          
                          const contribution = getContributionForDay(day);
                          const contributorCount = contribution?.contributors.length || 0;
                          const levelClass = getContributionLevel(contributorCount);
                          
                          return (
                            <Tooltip key={dayOfWeek}>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`w-[10px] h-[10px] rounded-[2px] cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${levelClass} ${isToday(day) ? 'ring-2 ring-primary' : ''}`}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs p-2">
                                <p className="text-muted-foreground mb-1">{format(day, 'MMM d, yyyy')}</p>
                                {contributorCount === 0 ? (
                                  <p className="text-muted-foreground">No activity</p>
                                ) : (
                                  <div className="space-y-1.5">
                                    {contribution?.contributors.map(({ user, role }) => (
                                      <div key={user.id} className="flex items-center gap-2">
                                        <Avatar className="h-5 w-5">
                                          <AvatarImage src={user.avatar} />
                                          <AvatarFallback className="text-[8px]">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium text-foreground">{user.name}</p>
                                          <p className="text-[10px] text-muted-foreground">{role}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-[2px]">
                <div className="w-[10px] h-[10px] rounded-[2px] bg-muted/50" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-primary/25" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-primary/50" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-primary/75" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-primary" />
              </div>
              <span>More</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
