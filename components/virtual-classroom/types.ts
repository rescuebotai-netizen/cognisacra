export interface ClassSession {
  id: string;
  title: string;
  courseName: string;
  instructor: string;
  dateTime: string;
  duration: string;
  isLive: boolean;
  meetingLink?: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  points: number;
  status: 'Assigned' | 'Submitted' | 'Past Due';
  score?: string;
  submittedAt?: string;
}

export interface Recording {
  id: string;
  title: string;
  courseName: string;
  date: string;
  duration: string;
  views: number;
  thumbnail: string;
  summary: string;
  topics: string[];
}

export interface ClassNote {
  id: string;
  title: string;
  courseName: string;
  date: string;
  summary: string;
  actionItems: string[];
  decisions: string[];
}

export interface ResourceFile {
  id: string;
  name: string;
  type: 'pdf' | 'slide' | 'video' | 'code';
  courseName: string;
  size: string;
  downloadUrl: string;
}

export interface DiscussionThread {
  id: string;
  title: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  upvotes: number;
  replies: DiscussionReply[];
}

export interface DiscussionReply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  isAI?: boolean;
}
