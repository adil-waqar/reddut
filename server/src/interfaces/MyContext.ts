import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import createUserLoader from 'src/utils/createUserLoader';

export interface MyContext {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
}
