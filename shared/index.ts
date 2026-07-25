export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type UserStatus = 'ONLINE' | 'BUSY' | 'AWAY' | 'OFFLINE';

export type ProjectStatus = 'PLANNING' | 'IN_DEVELOPMENT' | 'BETA' | 'COMPLETED' | 'MAINTAINED' | 'ARCHIVED';
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';

export type PostType = 
  | 'TEXT'
  | 'CODE_SNIPPET'
  | 'PROJECT_UPDATE'
  | 'QUESTION'
  | 'POLL'
  | 'ACHIEVEMENT'
  | 'COLLABORATION'
  | 'OPPORTUNITY';

export type ReactionType = 'LIKE' | 'USEFUL' | 'BRILLIANT' | 'SUPPORT' | 'DEBUGGED' | 'SHIP_IT';

export type NotificationType = 
  | 'FOLLOW'
  | 'CONNECTION_REQUEST'
  | 'CONNECTION_ACCEPT'
  | 'POST_REACTION'
  | 'POST_COMMENT'
  | 'COMMENT_REPLY'
  | 'MENTION'
  | 'MESSAGE'
  | 'PROJECT_STAR'
  | 'PROJECT_SAVE'
  | 'COLLABORATION_INVITE'
  | 'SYSTEM';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserBasicInfo {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  headline?: string;
  status: UserStatus;
  isVerified?: boolean;
}
