import {Request, Response, NextFunction} from 'express';
import {Result} from '../utils/Result';
import {ListRepository} from '../repositories/ListRepository';
import {ListUserRepository} from '../repositories/ListUserRepository';
import {UserRepository} from '../repositories/UserRepository';	
import {Role} from '../enum/Role';

export class ListController {
  private listRepository: ListRepository;
  private listUserRepository: ListUserRepository;
  private userRepository: UserRepository;

  constructor() {
    this.listRepository = new ListRepository();
    this.listUserRepository = new ListUserRepository();
    this.userRepository = new UserRepository();
  }

  verifyParams(req: Request) {
    if (!req.body.title || !req.body.user_id) {
      return false;
    }
    return true;
  }

  async verifyIfUserIsAdminOrOwner(user_id: number, list_id: number) {
    const user = await this.listUserRepository.findListUserByUserIdAndListId(user_id, list_id);
    if (!user) {
      return false;
    }
    return user.role === 'admin' || user.role === 'owner';
  }

  async verifyIfUserIsOwner(user_id: number, list_id: number) {
    const user = await this.listUserRepository.findListUserByUserIdAndListId(user_id, list_id);
    if (!user) {
      return false;
    }
    return user.role === 'owner';
  }

  async createList(req: Request) {
    if (!this.verifyParams(req)) {
      return Result.fail(400, 'Missing information');
    }
    const user = await this.userRepository.findUserById(req.body.user_id);
    if (!user) {
      return Result.fail(404, 'User not found');
    }

    const newList = {
      title: req.body.title,
      description: req.body.description,
    };

    const res1 = await this.listRepository.createList(newList);

    const listUser = {
      user_id: req.body.user_id,
      list_id: res1.data.id,
      role: Role.owner,
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
    const user = await this.userRepository.findUserById(req.body.user_id);
    if (!user) {
      return Result.fail(404, 'User not found');
    }
    const list = await this.listRepository.findListById(req.body.id);
    if (!list) {
      return Result.fail(404, 'List not found');
    }
    if (!(await this.verifyIfUserIsOwner(req.body.user_id, req.body.id))) {
      return Result.fail(401, 'Unauthorized: not the owner of this list');
    }

    return this.listRepository.deleteList(req.body.id);
  }

  async updateList(req: Request) {
    if (!req.body.id) {
      return Result.fail(400, 'Bad Request');
    }
    if (!req.body.title && !req.body.description) {
      return Result.fail(400, 'Bad Request');
    }
    const updateWith = {
      title: req.body.title,
      description: req.body.description,
    };
    return this.listRepository.updateList(req.body.id, updateWith);
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

  getList(req: Request, res: Response) {
    return this.listRepository.findListById(parseInt(req.params.id));
  }
}
