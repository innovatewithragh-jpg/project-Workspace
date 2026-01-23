import { useState } from 'react';
import { Bell, Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationItem } from './NotificationItem';
import { notifications as initialNotifications } from '@/data/mockNotifications';
import { NotificationType } from '@/types/notifications';

const filterTabs: { value: string; label: string; types?: NotificationType[] }[] = [
  { value: 'all', label: 'All' },
  { value: 'applications', label: 'Applications', types: ['role_application'] },
  { value: 'tasks', label: 'Tasks', types: ['task_completed', 'task_assigned'] },
  { value: 'team', label: 'Team', types: ['member_joined'] },
  { value: 'messages', label: 'Messages', types: ['chat_message'] },
];

export function NotificationsView() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    const tab = filterTabs.find(t => t.value === activeTab);
    if (!tab?.types) return true;
    return tab.types.includes(n.type);
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-4 border-b border-border">
          <TabsList className="bg-muted/50">
            {filterTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
