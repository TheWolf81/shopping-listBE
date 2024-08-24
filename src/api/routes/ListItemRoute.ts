import {NextFunction, Request, Response, Router} from 'express';
import {ListItemController} from '../../controller/ListItemController';
import {celebrate, Joi} from 'celebrate';

const ctrl = new ListItemController();

const route = Router();
export default (app: Router) => {
  app.use('/listItem', route);

  app.post(
    '/addListItem',
    celebrate({
      body: Joi.object({
        user_id: Joi.number().required(),
        list_id: Joi.number().required(),
        name: Joi.string().required(),
        unit: Joi.string().required(),
        quantity: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.addListItem(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  app.delete(
    '/removeListItem',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.removeListItem(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  app.put(
    '/changeListItemStatus',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
        status: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.changeListItemStatus(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  app.delete(
    '/deleteAllItemsInList',
    celebrate({
      body: Joi.object({
        list_id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.deleteAllItemsInList(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  app.put(
    '/updateListItem',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
        name: Joi.string(),
        unit: Joi.string(),
        quantity: Joi.number(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.updateListItem(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  app.get(
    '/getAllItemsInList/:list_id',
    celebrate({
      params: Joi.object({
        list_id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.getAllItemsInList(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );
};
