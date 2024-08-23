import {NextFunction, Request, Response, Router} from 'express';
import {ListItemController} from '../../controller/ListItemController';

const ctrl = new ListItemController();

const route = Router();
export default (app: Router) => {
  app.use('/listItem', route);

  app.post(
    '/addListItem',
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
    '/getAllItemsInList',
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
