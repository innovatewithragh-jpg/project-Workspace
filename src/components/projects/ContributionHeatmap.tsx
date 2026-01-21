import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectRole, User } from '@/types';
import { format, subDays, startOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
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

// Generate mock contribution data for each teammate
const generateMockContributions = (userId: string) => {
  const contributions: { date: Date; count: number }[] = [];
  const today = new Date();
  
  // Generate data for the last 20 weeks (140 days)
  for (let i = 0; i < 140; i++) {
    const date = subDays(today, i);
    // Random contribution count (0-4), weighted towards lower values
    const random = Math.random();
    let count = 0;
    if (random > 0.6) count = 1;
    if (random > 0.75) count = 2;
    if (random > 0.85) count = 3;
    if (random > 0.93) count = 4;
    
    contributions.push({ date, count });
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
          Team Contributions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TooltipProvider>
          {teammates.map(({ user, role }) => {
            const contributions = generateMockContributions(user.id);
            
            const getContributionForDay = (date: Date) => {
              return contributions.find(c => isSameDay(c.date, date))?.count || 0;
            };
            
            const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0);
            
            return (
              <div key={user.id} className="space-y-3">
                {/* Teammate header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {totalContributions} tasks completed
                  </span>
                </div>
                
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
                              
                              const count = getContributionForDay(day);
                              const levelClass = getContributionLevel(count);
                              
                              return (
                                <Tooltip key={dayOfWeek}>
                                  <TooltipTrigger asChild>
                                    <div 
                                      className={`w-[10px] h-[10px] rounded-[2px] cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${levelClass} ${isToday(day) ? 'ring-2 ring-primary' : ''}`}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    <p className="font-medium">{count} tasks</p>
                                    <p className="text-muted-foreground">{format(day, 'MMM d, yyyy')}</p>
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
            );
          })}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
