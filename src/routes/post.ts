import { Router } from 'express';
import { createDb } from '../utils/db';
const postRoute = Router();
const db = createDb();

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

export default postRoute;
