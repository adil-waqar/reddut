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
import { COOKIE_NAME, PORT, __prod__ } from './constants';
import { Post } from './entities/post.entity';
import { User } from './entities/user.entity';
import { MyContext } from './interfaces/MyContext';
import HelloResolver from './resolvers/hello.resolver';
import PostResolver from './resolvers/post.resolver';
import UserResolver from './resolvers/user.resolver';

export default class Application {
  public connection: Connection;
  public host: express.Application;
  public server: Server;
  public redis: _Redis;

  public connectToDB = async (): Promise<void> => {
    try {
      this.connection = await createConnection({
        type: 'postgres',
        database: 'lireddit2',
        username: 'postgres',
        password: 'postgres',
        logging: true,
        synchronize: true,
        migrations: [path.join(__dirname, './migrations/*')],
        entities: [Post, User]
      });
      console.log(`🤞 Database connected successfully`);
      // await this.connection.runMigrations();
    } catch (e) {
      console.error('🔥 Could not connect to the database', e);
      throw new Error(e);
    }
  };

  public connectToRedis = async (): Promise<void> => {
    try {
      this.redis = new Redis({ lazyConnect: true });
      await this.redis.connect();
      console.log(`🤞 Redis connected successfully`);
    } catch (e) {
      console.error('🔥 Could not connect to redis', e);
      throw new Error(e);
    }
  };

  public init = async (): Promise<void> => {
    const RedisStore = connectRedis(session);

    this.host = express();
    this.host.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
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
          secure: __prod__ // cookie only works in https
        },
        secret: 'ahdajhdjkahs',
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
        context: ({ req, res }): MyContext => ({ req, res, redis: this.redis })
      });

      apolloServer.applyMiddleware({
        app: this.host,
        cors: false
      });

      this.server = this.host.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}/graphql`);
      });
    } catch (e) {
      console.error('📌 Could not start server', e);
      throw new Error(e);
    }
  };
}
