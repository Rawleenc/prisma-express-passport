import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import startRoute from './routes';
import postRoute from './routes/post';
import userRoute from './routes/user';
import { Routes } from './utils/constants';
import * as swaggerDef from './utils/swagger.json';

export const app = express();

Sentry.init({
  dsn: 'https://d6a995df732641458c8261f58527b7c7@o571025.ingest.sentry.io/5718642',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.set('views', `${__dirname}/../views`);
app.set('view engine', 'ejs');

// Set express to use url encoded extended property. TLDR allows nested objects. & the responses to only be parsed as JSON
app.use(express.urlencoded({ extended: true }), express.json());
app.use(
  session({
    name: 'session',
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1, sameSite: 'lax' }, // 1 day expiration
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('', startRoute);
app.use(Routes.users, userRoute);
app.use(Routes.posts, postRoute);

// Swagger
app.use(Routes.docs, swaggerUi.serve, swaggerUi.setup(swaggerDef, { explorer: true }));

export const server = app.listen(`${process.env.PORT ?? 3000}`, () => {
  console.log(`Server ready & listening to http://localhost:${process.env.PORT || 3000}`);
});
