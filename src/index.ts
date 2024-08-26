import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const base = process.env;

async function startServer() {
  const app = express();

  await require('./loaders').default({expressApp: app});


  app
    .listen(base.EXPRESS_PORT, () => {
      console.log(`Server listening on port: ${base.EXPRESS_PORT}`);
    })
    .on('error', (err: any) => {
      console.error(err);
      process.exit(1);
    });
}

startServer();
