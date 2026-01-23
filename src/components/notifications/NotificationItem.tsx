import { formatDistanceToNow } from 'date-fns';
import { UserPlus, CheckCircle2, ListTodo, Users, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/types/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  role_application: <UserPlus className="h-4 w-4 text-primary" />,
  task_completed: <CheckCircle2 className="h-4 w-4 text-accent-foreground" />,
  task_assigned: <ListTodo className="h-4 w-4 text-primary" />,
  member_joined: <Users className="h-4 w-4 text-secondary-foreground" />,
  chat_message: <MessageCircle className="h-4 w-4 text-muted-foreground" />,
};

const notificationBadges: Record<NotificationType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  role_application: { label: 'Application', variant: 'default' },
  task_completed: { label: 'Task Done', variant: 'secondary' },
  task_assigned: { label: 'Assigned', variant: 'outline' },
  member_joined: { label: 'Joined', variant: 'secondary' },
  chat_message: { label: 'Message', variant: 'outline' },
};

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const { type, user, project, message, isRead, createdAt } = notification;

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg border border-border transition-colors cursor-pointer hover:bg-surface-hover',
        !isRead && 'bg-primary/5 border-primary/20'
      )}
      onClick={() => onMarkAsRead?.(notification.id)}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          {notificationIcons[type]}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-[10px]">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm text-foreground">{user.name}</span>
          <Badge variant={notificationBadges[type].variant} className="text-[10px] px-1.5 py-0">
            {notificationBadges[type].label}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {message}
          {project && (
            <span className="text-foreground font-medium"> in {project.title}</span>
          )}
        </p>
        
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
      </div>

      {/* Unread indicator */}
      {!isRead && (
        <div className="flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
}
