import expressLoader from './express';
import {Express} from 'express';

export default async ({expressApp}: {expressApp: Express}) => {
  await expressLoader({app: expressApp});
};
