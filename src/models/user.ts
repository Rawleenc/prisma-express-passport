import { Post, postTitle } from './post';

export interface User {
  id: number;
  email: string;
  displayName: string | null;
  posts?: Post[] | postTitle[] | null;
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
}

export type sanitizedUser = Omit<User, 'id' | 'password' | 'admin'>;
