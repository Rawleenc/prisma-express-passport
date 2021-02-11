import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import express from 'express';

const prisma = new PrismaClient();

const app = express();

// Set express to use url encoded extended property. TLDR allows nested objects. & the responses to only be parsed as JSON
app.use(express.urlencoded({ extended: true }), express.json());

app.use('/', async (_req, res) => {
  res.json(await prisma.post.findMany());
});

const server = app.listen(process.env.PORT, () => {
  console.log('Server ready & listening to http://localhost:' + process.env.PORT);
  console.log('keep alive timeout: ', server.keepAliveTimeout);
});
