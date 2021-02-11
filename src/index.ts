import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import express from 'express';
import { sanitizedUser } from './models/user';

const prisma = new PrismaClient();

const app = express();

// Set express to use url encoded extended property. TLDR allows nested objects. & the responses to only be parsed as JSON
app.use(express.urlencoded({ extended: true }), express.json());

app.use('/posts', async (_req, res) => {
  res.json(await prisma.post.findMany());
});

app.use('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  const sanitizedUsers: sanitizedUser[] = [];
  users.forEach(user => {
    sanitizedUsers.push({
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  return res.json(sanitizedUsers);
});

const server = app.listen(process.env.PORT, () => {
  console.log('Server ready & listening to http://localhost:' + process.env.PORT);
  console.log('keep alive timeout: ', server.keepAliveTimeout);
});
