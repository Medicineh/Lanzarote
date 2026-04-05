import { buildApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

const { httpServer } = buildApp();

async function start() {
  await connectDb();
  httpServer.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on :${env.port}`);
  });
}

start();
