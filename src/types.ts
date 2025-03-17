export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  registeredUsers: number;
  capacity: number;
  creator?: string;
  time?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joinDate: string;
}

export interface ForumPost {
  id: string;
  author: Member;
  content: string;
  timestamp: string;
  replies: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: Member;
  publishedAt: string;
  readTime: string;
  tags: string[];
  coverImage: string;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  author: Member;
  content: string;
  timestamp: string;
  likes: number;
  replies: BlogComment[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'editor' | 'admin';
  avatar: string;
  isTestUser?: boolean;
  joinDate?: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    email: string;
    website: string;
    twitter: string;
    linkedin: string;
  };
}