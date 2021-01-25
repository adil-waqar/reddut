import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { buildSchema } from 'type-graphql';
import { COOKIE_NAME, __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import HelloResolver from './resolvers/hello';
import PostResolver from './resolvers/post';
import UserResolver from './resolvers/user';
import { MyContext } from './types';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res, redis })
  });
  apolloServer.applyMiddleware({
    app,
    cors: false
  });
  app.listen(4000, () => {
    console.log('Server is listening on localhost:4000');
  });
};

main().catch((err) => {
  console.error(err);
});
