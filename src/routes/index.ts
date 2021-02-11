import { Router } from 'express';

const startRoute = Router();

startRoute.get('/', async (_req, res) => {
  return res.json({
    0: 'Hello and welcome.',
    1: 'This API is built up of the following: Users and Posts .',
    2: 'You can query users on /users and posts on /posts .',
    3: 'You can also get posts belonging to a user by using /users/[id]/posts .',
    4: 'Enjoy and have fun!',
  });
});

export default startRoute;
