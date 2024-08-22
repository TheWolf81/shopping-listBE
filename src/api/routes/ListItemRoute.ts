import {NextFunction, Request, Response, Router} from 'express';

const route = Router();
export default (app: Router) => {
  app.use('/listItem', route);
};
