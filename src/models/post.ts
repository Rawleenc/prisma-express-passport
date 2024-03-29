import { User } from './user';

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export type testPost = Pick<Post, 'title' | 'content'>;
export type postTitle = Pick<Post, 'title'>;
