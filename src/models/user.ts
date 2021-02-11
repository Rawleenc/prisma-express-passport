import { Post } from './post';

export class User {
  id: number;
  email: string;
  displayName?: string | null;
  posts?: Post[] | null;
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
}

export type sanitizedUser = Omit<User, 'id' | 'password' | 'admin' | 'posts'>;
