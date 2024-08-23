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
    '/login',
    celebrate({
      body: Joi.object({
        nickname: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ctrl.loginUser(req);
        return res.status(result.code).send(result.message);
      } catch (e) {
        console.log(e);
        return res.status(400).send('Bad Request');
      }
    }
  );

  /*route.put('/edit/:domainId',
      celebrate({
        body: Joi.object({
            domainId: Joi.string().optional(),
            code: Joi.string().required(),
            description: Joi.string().optional(),
            max_length: Joi.number().optional(),
            max_width: Joi.number().optional()
        }),
        params: Joi.object({
            domainId: Joi.string().required()
        })
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as winston.Logger;
        logger.debug('Calling Edit-Building endpoint with body: %o', req.body )
        try {
          const result = await axios.get('http://localhost:3100/api/users/me',{ headers: { Authorization: req.headers.authorization } });
        if(result.data.role !== 'CampusManager' && result.data.role !== 'SystemAdministrator'){
          return res.status(401).send('You are not Authorized');
        }
          const editedBuilding = await ctrl.editBuilding(req, res, next);
          return editedBuilding;
        } catch (e) {
          logger.error('🔥 error: %o',  e );
          return next(e);
        }
      },
    );*/

  /*route.get('/getAll', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as winston.Logger;
        logger.debug('Calling Get-All-Buildings endpoint');
        try {
            const result = await axios.get('http://localhost:3100/api/users/me',{ headers: { Authorization: req.headers.authorization } });
          if(result.data.role !== 'CampusManager' && result.data.role !== 'SystemAdministrator' && result.data.role !== 'Client'){
            return res.status(401).send('You are not Authorized');
          }
            const buildingsOrError = await ctrl.getAllBuildings(req, res, next);
            return buildingsOrError;
        } catch (e) {
            logger.error('🔥 error: %o',  e );
            return next(e);
        }
      });*/
};
