import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import express from 'express';
import { sanitizedUser } from './models/user';

const prisma = new PrismaClient();

const app = express();

// Set express to use url encoded extended property. TLDR allows nested objects. & the responses to only be parsed as JSON
app.use(express.urlencoded({ extended: true }), express.json());

app.use('/posts', async (_req, res) => {
  // imitate sanitizedPost by only selecting the displayName from the author on the post.
  const posts = await prisma.post.findMany({
    include: { author: { select: { displayName: true } } },
  });

  res.json(posts);
});

app.use('/users', async (_req, res) => {
  const users: sanitizedUser[] = await prisma.user.findMany({
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

const server = app.listen(process.env.PORT, () => {
  console.log('Server ready & listening to http://localhost:' + process.env.PORT);
  console.log('keep alive timeout: ', server.keepAliveTimeout);
});
