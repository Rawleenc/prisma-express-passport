import argon2id from 'argon2';
import { Router } from 'express';
import passport from 'passport';
import { createDb } from '../utils/db';
import { isLoggedIn } from './../utils/passport';

const db = createDb();
const startRoute = Router();

startRoute.get('', (req, res) => {
  res.render('home', { user: req.user });
});

startRoute.get('/home', (req, res) => {
  res.render('home', { user: req.user });
});

startRoute.get('/login', (_req, res) => {
  res.render('login');
});

startRoute.get('/register', (_req, res) => {
  res.render('register');
});

startRoute.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/profile' }));

startRoute.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

startRoute.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { user: req.user });
});

startRoute.post('/register', async (req, res) => {
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

export default startRoute;
