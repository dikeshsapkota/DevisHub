export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  status: 'ONLINE' | 'BUSY' | 'AWAY' | 'OFFLINE';
  isVerified?: boolean;
  isOnboarded?: boolean;
  createdAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  headline?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  availability?: string;
  currentRole?: string;
  openToCollaboration?: boolean;
  readmeMarkdown?: string;
  completionPercentage?: number;
  skills?: UserSkill[];
  experiences?: Experience[];
  educations?: Education[];
  socialLinks?: SocialLink[];
}

export interface UserSkill {
  id: string;
  yearsOfExp?: number;
  skill: {
    id: string;
    name: string;
    category?: string;
  };
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  repoUrl?: string;
  demoUrl?: string;
  docUrl?: string;
  status: 'PLANNING' | 'IN_DEVELOPMENT' | 'BETA' | 'COMPLETED' | 'MAINTAINED' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  license?: string;
  viewCount: number;
  createdAt: string;
  owner: User;
  technologies: { id: string; name: string }[];
  contributors?: { id: string; user: User; role?: string }[];
  documents?: ProjectDocument[];
  stars?: { id: string; userId: string }[];
  saves?: { id: string; userId: string }[];
  isStarred?: boolean;
  isSaved?: boolean;
  starsCount?: number;
  savesCount?: number;
  _count?: {
    stars?: number;
    saves?: number;
    contributors?: number;
  };
}

export interface ProjectDocument {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  projectId?: string;
  type: 'TEXT' | 'CODE_SNIPPET' | 'PROJECT_UPDATE' | 'QUESTION' | 'POLL' | 'ACHIEVEMENT' | 'COLLABORATION' | 'OPPORTUNITY';
  content: string;
  codeSnippet?: string;
  codeLang?: string;
  viewCount: number;
  createdAt: string;
  author: User;
  project?: Project;
  reactions: PostReaction[];
  comments: PostComment[];
  userReaction?: string | null;
  isSaved?: boolean;
  _count?: {
    reactions: number;
    comments: number;
    saves: number;
  };
}

export interface PostReaction {
  id: string;
  postId: string;
  userId: string;
  type: 'LIKE' | 'USEFUL' | 'BRILLIANT' | 'SUPPORT' | 'DEBUGGED' | 'SHIP_IT';
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  parentId?: string;
  content: string;
  createdAt: string;
  author: User;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  otherUser?: User;
  lastMessage?: ChatMessage;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string;
  createdAt: string;
  sender: User;
}
