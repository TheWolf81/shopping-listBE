import {NextFunction, Request, Response, Router} from 'express';
import {ListItemController} from '../../controller/ListItemController';
import {celebrate, Joi} from 'celebrate';

const ctrl = new ListItemController();

const route = Router();
export default (app: Router) => {
  app.use('/listItem', route);

  route.post(
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

  route.delete(
    '/removeListItem',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
        user_id: Joi.number().required(),
        list_id: Joi.number().required(),
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

  route.put(
    '/toggleListItemStatus',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.toggleListItemStatus(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  route.delete(
    '/deleteAllItemsInList',
    celebrate({
      body: Joi.object({
        list_id: Joi.number().required(),
        user_id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.deleteCheckedItemsInList(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  route.put(
    '/updateListItem',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
        user_id: Joi.number().required(),
        list_id: Joi.number().required(),
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

  route.get(
    '/getAllItemsInList/:list_id',
    celebrate({
      params: Joi.object({
        list_id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.getAllItemsInList(req, res);
        if(result.code === 200){
        return res.status(result.code).send(result.data);
        }
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  route.get('/getItemById/:id',
    celebrate({
      params: Joi.object({
        id: Joi.number().required(),
      }),
    }),
   async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.getItemById(req, res);
        if(!result){
          return res.status(404).send('Not Found');
        }
        if(result.code === 200){
        return res.status(result.code).send(result.data);
        }
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
  });

};
