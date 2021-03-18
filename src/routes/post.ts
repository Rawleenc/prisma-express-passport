import { Router } from 'express';
import { sanitizedUser } from '../models/user';
import prisma from '../utils/db';
import { isLoggedIn } from '../utils/passport';
import { postSchema } from './../models/joi';

const postRoute = Router();
const db = prisma;

//#region CREATE

/**
 * Registers a post title and content
 */
postRoute.post('/', isLoggedIn, async (req, res) => {
  const { error } = postSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0] });

  db.post
    .create({
      data: {
        title: req.body.title,
        content: req.body.content,
        author: { connect: { email: (req.user as sanitizedUser).email } },
      },
    })
    .then(post => res.status(200).json(post))
    .catch(_err => res.status(400).json('Unable to create post'));
});
//#endregion

//#region READ

/**
 * Get all posts
 */
postRoute.get('/', async (_req, res) => {
  // imitate sanitizedPost by only selecting the displayName from the author on the post.
  const posts = await db.post.findMany({
    include: { author: { select: { displayName: true } } },
  });

  if (!posts) return res.status(404).json('Unable to find posts');

  res.json(posts);
});

/**
 * Gets a post by id.
 */
postRoute.get('/:id', async (req, res) => {
  const { id } = req.params;

  // imitate sanitizedPost by only selecting the displayName from the author on the post.
  const post = await db.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: { select: { displayName: true } },
    },
  });

  if (!post) return res.status(404).json('Unable to find post');

  res.json(post);
});
//#endregion

//#region UPDATE

/**
 * Updates a post, only works if logged in. Requires the body to contain
 * "title" (string), "content" (string), optional "published" (boolean)
 */
postRoute.put('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const { error } = postSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0] });

  const post = await db.post.findUnique({ where: { id: parseInt(id) }, include: { author: true } });
  if (!post) return res.status(404).json('Unable to find post');

  const { email } = req.user as sanitizedUser;

  if (post.author?.email !== email) return res.status(403).json("You don't have permission to update this");

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
/**
 * Deletes a post, only works if logged in and user is author of post
 */
postRoute.delete('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const post = await db.post.findUnique({ where: { id: parseInt(id) }, include: { author: true } });
  if (!post) return res.status(404).json('Unable to find post');

  const { email } = req.user as sanitizedUser;

  if (post.author?.email !== email) return res.status(403).json("You don't have permission to delete this");

  db.post
    .delete({ where: { id: parseInt(id) } })
    .then(post => res.status(200).json(post))
    .catch(_err => res.status(400).json('Unable to delete post'));
});
//#endregion
export default postRoute;
