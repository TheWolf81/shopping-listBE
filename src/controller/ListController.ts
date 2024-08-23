import {Request, Response, NextFunction} from 'express';
import {Result} from '../utils/Result';
import {ListRepository} from '../repositories/ListRepository';
import {ListUserRepository} from '../repositories/ListUserRepository';

export class ListController {
  private listRepository: ListRepository;
  private listUserRepository: ListUserRepository;

  constructor() {
    this.listRepository = new ListRepository();
    this.listUserRepository = new ListUserRepository();
  }

  verifyParams(req: Request) {
    if (!req.body.title || !req.body.user_id) {
      return false;
    }
    return true;
  }

  async createList(req: Request) {
    if (!this.verifyParams(req)) {
      return Result.fail(400, 'Parameters missing');
    }
    const newList = {
      title: req.body.title,
      description: req.body.description,
    };

    const res1 = await this.listRepository.createList(newList);

    const listUser = {
      user_id: req.body.user_id,
      list_id: res1.data.id,
      role: 'admin',
    };
    const res2 = await this.listUserRepository.createListUser(listUser);
    if (Result.isSuccessful(res1) && Result.isSuccessful(res2)) {
      return Result.success('List created successfully');
    }
    return Result.fail(400, 'Error creating list');
  }

  async deleteList(req: Request, res: Response) {
    if (!req.body.id) {
      return Result.fail(400, 'Bad Request');
    }
    return this.listRepository.deleteList(req.body.id);
  }

  async getAllLists() {
    const lists = await this.listRepository.getAll();
    if (lists.length > 0) {
      return Result.success(lists);
    }
    return Result.fail(404, 'No lists found');
  }

  async getListById(req: Request) {
    if (!req.params.id) {
      return Result.fail(400, 'Bad Request');
    }
    const list = await this.listRepository.findListById(
      parseInt(req.params.id)
    );
    if (list) {
      return Result.success(list);
    }
    return Result.fail(404, 'List not found');
  }
}
