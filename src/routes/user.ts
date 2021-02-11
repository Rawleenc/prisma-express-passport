import { Router } from 'express';
import { createDb } from '../models/context';
import { sanitizedUser } from './../models/user';

const userRoute = Router();
const db = createDb();

userRoute.get('/', async (_req, res) => {
  const users: sanitizedUser[] = await db.user.findMany({
    select: {
      email: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
      posts: { select: { title: true } },
    },
  });

  return res.json(users);
});

userRoute.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await db.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      email: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
      posts: { select: { title: true } },
    },
  });

  if (!user) res.json({ error: 'Unable to find user' });
  else res.json(user);
});

userRoute.get('/:id/posts', async (req, res) => {
  const { id } = req.params;

  const posts = await db.post.findMany({
    where: { userId: parseInt(id) },
    select: {
      author: { select: { displayName: true } },
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      published: true,
    },
  });

  res.json(posts);
});

export default userRoute;
