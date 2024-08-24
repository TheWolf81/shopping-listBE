import {NextFunction, Request, Response, Router} from 'express';
import {celebrate, Joi} from 'celebrate';
import {ListUserController} from '../../controller/ListUserController';

const ctrl = new ListUserController();

const route = Router();
export default (app: Router) => {
  app.use('/listUser', route);

  app.get(
    '/listUsersInList',
    celebrate({
      body: Joi.object({
        list_id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.listUsersInList(req, res);
        return res.status(result.code).send(result.data);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  app.get(
    '/listListsForUser',
    celebrate({
      body: Joi.object({
        user_id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.listListsForUser(req, res);
        return res.status(result.code).send(result.data);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  app.post(
    '/addUserToList',
    celebrate({
      body: Joi.object({
        user_id: Joi.number().required(),
        list_id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.addUserToList(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );
  app.put(
    '/updateListUserRole',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
        role: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.updateListUserRole(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  app.delete(
    '/removeUserFromList',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.removeUserFromList(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );
};
