export type ProjectStatus = 'planning' | 'active' | 'paused' | 'done';

export type TaskStatus = 'idea' | 'todo' | 'in_progress' | 'testing' | 'done';

export type UserRole = 'creator' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  isOnline?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  owners: User[];
  members: User[];
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
  dueDate?: Date;
  tasksCompleted: number;
  tasksTotal: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assignees: User[];
  status: TaskStatus;
  dueDate?: Date;
  tags: string[];
  subtasks: Subtask[];
  attachments: Attachment[];
  comments: Comment[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  author: User;
  text: string;
  attachments?: Attachment[];
  timestamp: Date;
  reactions?: { emoji: string; users: User[] }[];
}

export interface ActivityItem {
  id: string;
  projectId: string;
  user: User;
  action: string;
  target: string;
  timestamp: Date;
}
