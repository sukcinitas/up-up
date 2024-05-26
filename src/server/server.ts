import passport from 'passport';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import path from 'path';
import helmet from 'helmet';
import connectMongo from 'connect-mongo';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { redirectToHTTPS } from 'express-http-to-https';

import userRouter from './routes/user.route';
import pollRouter from './routes/poll.route';

dotenv.config();

const app = express();
app.use(helmet());

app.use(
  session({
    name: process.env.SESS_NAME,
    secret: process.env.SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    store: connectMongo.create({
      collectionName: 'session',
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60,
      autoRemove: 'native',
    }),
    cookie: {
      sameSite: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
      httpOnly: true,
      path: '/',
    },
    unset: 'destroy',
  }),
);

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // instead of bodyParser, since 4.16 Express; extended
app.set('trust proxy', 1);
app.use(passport.initialize());
app.use(passport.session());

let corsOptions;
if (process.env.NODE_ENV === 'development') {
  corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
  };
} else {
  corsOptions = {
    credentials: true,
    origin: 'http://up-up.herokuapp.com',
  };
}
app.use(cors(corsOptions));

app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

app.use(express.static('dist'));

const uri = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);
mongoose.connect(uri);

const { connection } = mongoose;
connection.once('open', () => {
  console.log('Connection with MongoDB database established');
});

app.use('/api/polls', pollRouter);
app.use('/api/user', userRouter);

app.all('*', (req, res) => {
  res.sendFile(
    path.join(process.cwd(), '/dist/index.html'),
    (err) => {
      if (err) {
        res.status(500).send(err);
      }
    },
  );
});

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log('App is running!');
});
