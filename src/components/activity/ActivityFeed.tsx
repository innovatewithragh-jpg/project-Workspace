import { formatDistanceToNow } from 'date-fns';
import { ActivityItem as ActivityItemType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityFeedProps {
  activities: ActivityItemType[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-5 h-full shadow-lg shadow-background/10">
      <h3 className="font-semibold text-foreground mb-5 text-base">Recent Activity</h3>
      <ScrollArea className="h-[320px] pr-2">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-hover/50 transition-all duration-200 group animate-enter"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-background/50">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {activity.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">
                  <span className="font-medium text-foreground">{activity.user.name}</span>
                  {' '}
                  <span className="text-muted-foreground">{activity.action}</span>
                  {' '}
                  <span className="text-foreground font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
