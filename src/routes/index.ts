import { Router } from 'express';
import passport from 'passport';
import { isLoggedIn } from './../utils/passport';

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

startRoute.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/profile' }));

startRoute.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

startRoute.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { user: req.user });
});

export default startRoute;
