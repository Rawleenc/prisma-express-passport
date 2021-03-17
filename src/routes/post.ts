import { Router } from 'express';
import prisma from '../utils/db';
import { User } from './../models/user';
import { isLoggedIn } from './../utils/passport';

const postRoute = Router();
const db = prisma;

//#region CREATE
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
//#endregion

//#region READ
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
//#endregion

//#region UPDATE
postRoute.put('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const post = await db.post.findUnique({ where: { id: parseInt(id) }, include: { author: true } });
  if (!post) return res.status(404).json('Unable to find post');

  const reqUser = req.user as User;

  if (post.author.id !== reqUser.id) return res.status(403).json("You don't have permission to update this");

  db.post
    .update({
      where: { id: parseInt(id) },
      data: {
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
      },
    })
    .then(post => res.status(200).json(post))
    .catch(_err => res.status(400).json('Unable to delete post'));
});
//#endregion

//#region DELETE
postRoute.delete('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const post = await db.post.findUnique({ where: { id: parseInt(id) }, include: { author: true } });
  if (!post) return res.status(404).json('Unable to find post');

  const reqUser = req.user as User;

  if (post.author.id !== reqUser.id) return res.status(403).json("You don't have permission to delete this");

  db.post
    .delete({ where: { id: parseInt(id) } })
    .then(post => res.status(200).json(post))
    .catch(_err => res.status(400).json('Unable to delete post'));
});
//#endregion
export default postRoute;
