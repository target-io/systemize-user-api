import server from './shared/server';
import router from './routes';
import env from './config/env';
import middleware from './shared/server/middlewares';
import listeners from './shared/server/events/listeners';
import * as figlet from 'figlet';
import DbController from './shared/class/DbController';

import * as sourceMapSupport from 'source-map-support';

sourceMapSupport.install();
process.on('unhandledRejection', console.log);

const db = new DbController();

middleware.initMiddlewares();
router.initRoutes();
middleware.initExceptionMiddlewares();
listeners.startListening();

server.listen(env.server_port, async () => {
  await db.connect();
  console.log("\x1b[31m", figlet.textSync('systemize-user-api', {
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }), "\x1b[0m");
  console.log(`Opening the gates in ${env.server_port}`);
});
