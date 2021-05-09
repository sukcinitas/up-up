/* eslint-disable no-console */
import * as passport from 'passport';
import * as express from 'express';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as session from 'express-session';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as path from 'path';
import * as connectMongo from 'connect-mongo';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import userRouter from './routes/user.route';
import pollRouter from './routes/poll.route';

dotenv.config();
const MongoStore = connectMongo(session);

(async () => {
  try {
    // mongoose.Promise = global.Promise;
    mongoose.set('useFindAndModify', false);

    const app = express();
    app.use(
      session({
        name: process.env.SESS_NAME,
        secret: process.env.SESS_SECRET,
        saveUninitialized: false,
        resave: false,
        store: new MongoStore({
          mongooseConnection: mongoose.connection,
          collection: 'session',
          ttl: 60 * 60,
          autoRemove: 'native',
        }),
        cookie: {
          sameSite: false,
          secure: process.env.NODE_ENV === 'prod',
          maxAge: 86400000,
          httpOnly: true,
        },
        unset: 'destroy',
      }),
    );

    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    app.use(express.json()); // instead of bodyParser, since 4.16 Express; extended
    app.set('trust proxy', 1);
    app.use(passport.initialize());
    app.use(passport.session());

    if (process.env.NODE_ENV === 'development') {
      const corsOptions = {
        credentials: true,
        origin: 'http://localhost:3000',
      };
      app.use(cors(corsOptions));
    }

    // app.use(express.static('dist'));
    // app.use((req, res, next) => {
    //   res.header('Access-Control-Allow-Credentials', 'true');
    //   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    //   res.header(
    //     'Access-Control-Allow-Headers',
    //     'Origin, X-Requested-With, Content-Type, Accept',
    //   );
    //   res.header(
    //     'Access-Control-Allow-Method',
    //     'GET, POST, PUT, PATCH, POST, DELETE, HEAD, OPTIONS',
    //   );
    //   res.header('Access-Control-Max-Age', '86400');
    //   next();
    // });

    const uri = process.env.MONGODB_URI;
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    const { connection } = mongoose;
    connection.once('open', () => {
      console.log('Connection with MongoDB database established');
    });
    app.use('/api/polls', pollRouter);
    app.use('/api/user', userRouter);

    app.all('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), '/dist/index.html'), (err) => {
        if (err) {
          res.status(500).send(err);
        }
      });
    });
    app.use((err: Error, req: Request, res: Response) => {
      console.error(err.stack);
      res.status(500).end();
    });
    app.listen(process.env.PORT || 8080, () => {
      console.log('App is running!');
    });
  } catch (err) {
    console.error(err);
  }
})();
