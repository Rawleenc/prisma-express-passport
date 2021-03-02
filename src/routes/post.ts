import { Router } from 'express';
import prisma from '../utils/db';
import { User } from './../models/user';
import { isLoggedIn } from './../utils/passport';
const postRoute = Router();
const db = prisma;

postRoute.get('/', async (_req, res) => {
  // imitate sanitizedPost by only selecting the displayName from the author on the post.
  const posts = await db.post.findMany({
    include: { author: { select: { displayName: true } } },
  });

  res.json(posts);
});

postRoute.get('/:id', async (req, res) => {
  const { id } = req.params;

  // imitate sanitizedPost by only selecting the displayName from the author on the post.
  const posts = await db.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: { select: { displayName: true } },
    },
  });

  res.json(posts);
});

postRoute.post('/', isLoggedIn, async (req, res) => {
  db.post
    .create({
      data: {
        title: req.body.title,
        content: req.body.content,
        author: { connect: { id: (req.user as User).id } },
      },
    })
    .then(post => res.status(200).json(post))
    .catch(_err => res.status(400).json('Unable to create post'));
});

export default postRoute;
