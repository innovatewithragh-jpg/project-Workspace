import { User, Project } from './index';

export type NotificationType = 
  | 'role_application'
  | 'task_completed'
  | 'task_assigned'
  | 'member_joined'
  | 'chat_message';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  user: User;
  project?: Project;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}
