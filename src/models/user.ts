import { Post, sanitizedPost } from './post';

export class User {
  id: number;
  email: string;
  displayName: string | null;
  posts: Post[] | sanitizedPost[] | null;
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
}

export type sanitizedUser = Omit<User, 'id' | 'password' | 'admin'>;
