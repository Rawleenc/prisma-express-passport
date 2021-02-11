import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import startRoute from './routes';
import postRoute from './routes/post';
import userRoute from './routes/user';

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Set express to use url encoded extended property. TLDR allows nested objects. & the responses to only be parsed as JSON
app.use(express.urlencoded({ extended: true }), express.json());
app.use(session({ secret: process.env.SECRET!, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('', startRoute);
app.use('/users', userRoute);
app.use('/posts', postRoute);

const server = app.listen(process.env.PORT, () => {
  console.log('Server ready & listening to http://localhost:' + process.env.PORT);
  console.log('keep alive timeout: ', server.keepAliveTimeout);
});
