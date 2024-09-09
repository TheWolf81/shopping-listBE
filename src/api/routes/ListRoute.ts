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
        user_id: Joi.number().required(),
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

  route.get(
    '/getList/:id',
    celebrate({
      params: Joi.object({
        id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.getList(req, res);
        return res.status(result.code).send(result.data);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  route.put('/edit',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
        title: Joi.string().required(),
        description: Joi.string()
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ctrl.updateList(req);
      return res.status(result.code).send(result.message);
    } catch (e) {
      console.log(e);
      return res.status(400).send('Bad Request');
    }
  }
  );
};
