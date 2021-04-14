import argon2id from 'argon2';
import { Router } from 'express';
import passport from 'passport';
import { registerSchema } from '../models/joi';
import prisma from '../utils/db';
import { isLoggedIn } from '../utils/passport';

const db = prisma;
const startRoute = Router();

//#region Views (render)
startRoute.get('', (req, res) => {
  res.render('home', { user: req.user });
});

startRoute.get('/home', (req, res) => {
  res.render('home', { user: req.user });
});

startRoute.get('/create-post', (req, res) => {
  res.render('create-post', { user: req.user });
});

//#region Authentication
startRoute.get('/login', (_req, res) => {
  res.render('login');
});

startRoute.get('/register', (_req, res) => {
  res.render('register');
});

startRoute.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { user: req.user });
});
//#endregion

//#endregion

/**
 * Requests a login, will authenticate with Passport (utils/passport) - redirects on success or failure
 */
startRoute.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/profile' }));

/**
 * Logs out the user, cannot possibly fail. IGN rates 10/10
 */
startRoute.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//#region CREATE

/**
 * Registers a user with an  email, password and display name
 */
startRoute.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) return res.status(400).json({ error: error.details[0] });

  await db.user
    .create({
      data: {
        email: req.body.email,
        password: await argon2id.hash(req.body.password),
        displayName: req.body.displayName,
      },
    })
    .then(_user => {
      res.redirect('/login');
    })
    .catch(() => res.status(400).json('Unable to add user'));
});
//#endregion

//#region Sentry
startRoute.get('/debug-sentry', function mainHandler(_req, _res) {
  throw new Error('My first Sentry error!');
});
//#endregion

export default startRoute;
