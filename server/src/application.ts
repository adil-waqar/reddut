import { ApolloServer } from 'apollo-server-express/dist/ApolloServer';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { Server } from 'http';
import Redis, { Redis as _Redis } from 'ioredis';
import path from 'path';
import { buildSchema } from 'type-graphql';
import { Connection, createConnection } from 'typeorm';
import {
  COOKIE_NAME,
  CORE_ORIGIN,
  DATABASE_URL,
  PORT,
  REDIS_URL,
  SESSION_SECRET,
  __prod__
} from './constants';
import { Post } from './entities/post.entity';
import { Updoot } from './entities/updoot.entity';
import { User } from './entities/user.entity';
import { MyContext } from './interfaces/MyContext';
import HelloResolver from './resolvers/hello.resolver';
import PostResolver from './resolvers/post.resolver';
import UserResolver from './resolvers/user.resolver';
import createUserLoader from './utils/createUserLoader';

export default class Application {
  public connection: Connection;
  public host: express.Application;
  public server: Server;
  public redis: _Redis;

  constructor() {
    // Attaching a SIGINT listener on application instantiation
    process.on('SIGINT', async () => {
      console.log(`🙋‍♂️ Application is exiting, closing all foreign connections`);
      await this.connection.close();
      await this.shutdownSever();
      this.redis.disconnect();
      process.exit(0);
    });
  }

  public connectToDB = async (): Promise<void> => {
    try {
      this.connection = await createConnection({
        type: 'postgres',
        url: DATABASE_URL,
        logging: !__prod__,
        synchronize: !__prod__,
        migrations: [path.join(__dirname, './migrations/*')],
        entities: [Post, User, Updoot]
      });
      if (__prod__) await this.connection.runMigrations();
      console.log(`🤞 Database connected successfully`);
    } catch (e) {
      console.error('🔥 Could not connect to the database', e);
      throw new Error(e);
    }
  };

  public connectToRedis = async (): Promise<void> => {
    try {
      this.redis = new Redis(REDIS_URL, { lazyConnect: true });
      await this.redis.connect();
      console.log(`🤞 Redis connected successfully`);
    } catch (e) {
      console.error('🔥 Could not connect to redis', e);
      throw new Error(e);
    }
  };

  private shutdownSever = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) reject();
        else resolve();
      });
    });
  };

  public init = async (): Promise<void> => {
    const RedisStore = connectRedis(session);

    this.host = express();
    this.host.set('trust proxy', 1);
    this.host.use(
      cors({
        credentials: true,
        origin: [CORE_ORIGIN, 'http://localhost:3000', 'http://web:3000']
      })
    );
    this.host.use(
      session({
        name: COOKIE_NAME,
        store: new RedisStore({
          client: this.redis,
          disableTouch: true
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true, // cant access cookie in js
          sameSite: 'lax', //csrf
          secure: false // cookie only works in https
        },
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false
      })
    );

    try {
      const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [HelloResolver, PostResolver, UserResolver],
          validate: false
        }),
        context: ({ req, res }): MyContext => ({
          req,
          res,
          redis: this.redis,
          userLoader: createUserLoader()
        })
      });

      apolloServer.applyMiddleware({
        app: this.host,
        cors: false
      });

      this.server = this.host.listen(
        PORT,
        __prod__ ? '0.0.0.0' : '127.0.0.1',
        () => {
          console.log(
            `🚀 Server is running at http://localhost:${PORT}/graphql`
          );
        }
      );
    } catch (e) {
      console.error('📌 Could not start server', e);
      throw new Error(e);
    }
  };
}
