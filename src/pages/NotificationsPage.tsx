import { TopBar } from '@/components/layout/TopBar';
import { NotificationsView } from '@/components/notifications/NotificationsView';

const NotificationsPage = () => {
  return (
    <div className="h-screen bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto border-x border-border h-screen flex flex-col overflow-hidden">
        <TopBar />
        <NotificationsView />
      </div>
    </div>
  );
};

export default NotificationsPage;
