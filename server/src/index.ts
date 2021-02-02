import 'dotenv-safe/config';
import 'reflect-metadata';
import Application from './application';

(async () => {
  const application = new Application();
  await application.connectToDB();
  await application.connectToRedis();
  await application.init();
})();
