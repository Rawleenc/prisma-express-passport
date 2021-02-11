import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import postRoute from './routes/post';
import userRoute from './routes/user';
import { isLoggedIn } from './utils/passport';

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Set express to use url encoded extended property. TLDR allows nested objects. & the responses to only be parsed as JSON
app.use(express.urlencoded({ extended: true }), express.json());
app.use(session({ secret: process.env.SECRET!, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Routes
// app.use('', startRoute); removed because EJS was added
app.use('/users', userRoute);
app.use('/posts', postRoute);

app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/home', (req, res) => {
  res.render('home', { user: req.user });
});
app.get('/login', (_req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/profile' }));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { user: req.user });
});

const server = app.listen(process.env.PORT, () => {
  console.log('Server ready & listening to http://localhost:' + process.env.PORT);
  console.log('keep alive timeout: ', server.keepAliveTimeout);
});
