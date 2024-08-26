import {NextFunction, Request, Response, Router} from 'express';
import {celebrate, Joi} from 'celebrate';
import {UserController} from '../../controller/UserController';

const ctrl = new UserController();

const route = Router();
export default (app: Router) => {
  app.use('/user', route);
  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        nickname: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.createUser(req);
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
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.deleteUser(req, res);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  route.get(
    '/getAll',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.getAllUsers();
        return res.status(result.code).send(result.data);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  route.get(
    '/getById/:id',
    celebrate({
      params: Joi.object({
        id: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.getUserById(req);
        return res.status(result.code).send(result.data);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  route.get(
    '/login/:nickname/:password',
    celebrate({
      params: Joi.object({
        nickname: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.loginUser(req);
        if(result.data){
        return res.status(result.code).send(result.data);
        } else {
          return res.status(result.code).send(result.message);
        }
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

};
