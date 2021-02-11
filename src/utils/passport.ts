import argon2id from 'argon2';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../models/user';
import { createDb } from './db';

const db = createDb();
const response = 'Invalid login credentials';

passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) return done(response);
    else if (user) {
      const passMatch = await argon2id.verify(user.password, password);

      if (passMatch) return done(null, user);

      return done(response);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id: string | number, done) => {
  const user = await db.user.findUnique({ where: { id: parseInt(id.toString()) } });
  if (!user) return done('No user to deserialize');

  return done(null, user);
});

/**
 * Login Required middleware.
 */
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();

  res.redirect('/login');
};