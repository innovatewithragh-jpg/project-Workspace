import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Notification } from '@/types/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const { user, project, message, isRead, createdAt } = notification;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted/50',
        !isRead && 'bg-primary/5'
      )}
      onClick={() => onMarkAsRead?.(notification.id)}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="text-xs">
          {user.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">
          <span className="font-medium">{user.name}</span>
          <span className="text-muted-foreground"> {message}</span>
          {project && <span className="text-muted-foreground"> in </span>}
          {project && <span className="font-medium">{project.title}</span>}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
      </div>

      {!isRead && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
    </div>
  );
}
