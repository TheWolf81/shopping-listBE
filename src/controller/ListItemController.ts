import {Request, Response, NextFunction} from 'express';
import {Result} from '../utils/Result';
import {ListItemRepository} from '../repositories/ListItemRepository';

export class ListItemController {
  private listItemRepository: ListItemRepository;

  constructor() {
    this.listItemRepository = new ListItemRepository();
  }

  async addListItem(req: Request, res: Response) {
    if (
      !req.body.user_id ||
      !req.body.list_id ||
      !req.body.name ||
      !req.body.unit ||
      !req.body.quantity
    ) {
      return Result.fail(400, 'Bad Request');
    }
    const listItem = {
      user_id: req.body.user_id,
      list_id: req.body.list_id,
      name: req.body.name,
      unit: req.body.unit,
      quantity: req.body.quantity,
      status: Status.listed,
    };
    return this.listItemRepository.createListItem(listItem);
  }

  async removeListItem(req: Request, res: Response) {
    if (!req.body.id) {
      return Result.fail(400, 'Bad Request');
    }
    return this.listItemRepository.deleteListItem(req.body.id);
  }
  async changeListItemStatus(req: Request, res: Response) {
    if (!req.body.id || !req.body.status) {
      return Result.fail(400, 'Bad Request');
    }
    return this.listItemRepository.changeItemStatus(
      req.body.id,
      req.body.status
    );
  }

  async deleteAllItemsInList(req: Request, res: Response) {
    if (!req.body.list_id) {
      return Result.fail(400, 'Bad Request');
    }
    return this.listItemRepository.deleteAllItemsFromList(req.body.list_id);
  }

  async updateListItem(req: Request, res: Response) {
    if (!req.body.id) {
      return Result.fail(400, 'Bad Request');
    }
    return this.listItemRepository.updateListItem(req.body.id, req.body);
  }

  async getAllItemsInList(req: Request, res: Response) {
    if (!req.body.list_id) {
      return Result.fail(400, 'Bad Request');
    }
    return this.listItemRepository.findItemsInList(req.body.list_id);

}
}
