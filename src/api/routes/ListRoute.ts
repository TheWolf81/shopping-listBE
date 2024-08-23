import {NextFunction, Request, Response, Router} from 'express';
import {ListController} from '../../controller/ListController';
import {celebrate, Joi} from 'celebrate';

const ctrl = new ListController();

const route = Router();
export default (app: Router) => {
  app.use('/list', route);

  route.post(
    '/create',

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.createList(req);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  route.delete(
    '/delete',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.deleteList(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );
};
