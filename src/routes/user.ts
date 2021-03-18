import argon2id from 'argon2';
import { Router } from 'express';
import prisma from '../utils/db';
import { isLoggedIn } from '../utils/passport';
import { userSchema } from './../models/joi';
import { sanitizedUser } from './../models/user';

const userRoute = Router();
const db = prisma;

//Creating user is handled in index.ts (Register)

//#region READ

/**
 * Get all users (as sanitized users, stripping away some data. Shown in models/user)
 */
userRoute.get('/', async (req, res) => {
  const users: sanitizedUser[] = await db.user.findMany({
    select: {
      email: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Hide other users email from request
  users.forEach(u => {
    const user = req.user as sanitizedUser | undefined;
    if (u.email !== user?.email) u.email = '';
  });

  return res.json(users);
});

/**
 * Gets a specific user if possible
 */
userRoute.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user: sanitizedUser | null = await db.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      email: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) res.json({ error: 'Unable to find user' });
  else res.json(user);
});

/**
 * Gets the posts of a specific user if possible
 */
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
//#endregion

//#region UPDATE

/**
 * Updatess a user, only works if logged in and user is themself
 */
userRoute.put('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0] });

  const user = await db.user.findUnique({ where: { id: parseInt(id) } });
  if (!user) return res.status(404).json('Unable to find user');

  const { email } = req.user as sanitizedUser;
  if (user.email !== email) return res.status(403).json("You don't have permission to update this");

  db.user
    .update({
      where: { id: parseInt(id) },
      data: {
        email: req.body.email,
        password: req.body.password ? await argon2id.hash(req.body.password) : undefined,
        displayName: req.body.displayName,
      },
    })
    .then(post => res.status(200).json(post))
    .catch(_err => res.status(400).json('Unable to delete post'));
});
//#endregion

//#region DELETE

/**
 * Deletes a user, only works if logged in and user is themself
 * Also deletes all the posts, if cascade delete doesn't.
 */
userRoute.delete('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const user = await db.user.findUnique({ where: { id: parseInt(id) } });
  if (!user) return res.status(404).json('Unable to find user');

  const { email } = req.user as sanitizedUser;

  if (user.email !== email) return res.status(403).json("You don't have permission to delete this");

  db.user
    .delete({ where: { id: parseInt(id) } })
    .then(async (user: sanitizedUser) => {
      req.logout();
      await prisma.post.deleteMany({ where: { userId: null } });
      res.status(200).json(user);
    })
    .catch(_err => {
      console.log(_err);
      res.status(400).json('Unable to delete user');
    });
});
//#endregion
export default userRoute;
