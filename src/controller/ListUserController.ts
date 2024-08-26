import {ListUserRepository} from '../repositories/ListUserRepository';
import {Request, Response, NextFunction} from 'express';
import {Result} from '../utils/Result';
import {Role} from '../enum/Role';

export class ListUserController {
  private listUserRepository: ListUserRepository;

  constructor() {
    this.listUserRepository = new ListUserRepository();
  }
  async verifyIfUserIsAdmin(user_id: number, list_id: number) {
    const user = await this.listUserRepository.findListUserByUserIdAndListId(user_id, list_id);
    if (!user) {
      return false;
    }
    return user.role === 'admin';
  }

  async verifyIfUserIsMember(user_id: number, list_id: number) {
    const user = await this.listUserRepository.findListUserByUserIdAndListId(user_id, list_id);
    return !!user;
  }

  async listUsersInList(req: Request, res: Response) {
    if (!req.body.list_id) {
      return Result.fail(400, 'Bad Request');
    }
    const users = await this.listUserRepository.listUsersInList(
      req.body.list_id
    );
    if (users.length > 0) {
      return Result.success(users);
    }
    return Result.fail(404, 'No users found');
  }

  async listListsForUser(req: Request, res: Response) {
    if (!req.body.user_id) {
      return Result.fail(400, 'Bad Request');
    }
    const lists = await this.listUserRepository.listListsForUser(
      req.body.user_id
    );
    if (lists.length > 0) {
      return Result.success(lists);
    }
    return Result.fail(404, 'No lists found');
  }

  async updateListUserRole(req: Request, res: Response) {
    if (!req.body.id || !req.body.role) {
      return Result.fail(400, 'Bad Request');
    }
    if(!(await this.verifyIfUserIsAdmin(req.body.current_user_id, req.body.list_id))){
      return Result.fail(401, 'Unauthorized');
    }
    return this.listUserRepository.updateListUserRole(
      req.body.id,
      req.body.role
    );
  }

  async addUserToList(req: Request, res: Response) {
    if (!req.body.user_id || !req.body.list_id) {
      return Result.fail(400, 'Bad Request');
    }
    if(await this.verifyIfUserIsMember(req.body.user_id, req.body.list_id)){
      return Result.fail(409, 'User is already in list');
    }
    const listUser = {
      user_id: req.body.user_id,
      list_id: req.body.list_id,
      role: Role.member,
    };
    return this.listUserRepository.createListUser(listUser);
  }

  async removeUserFromList(req: Request, res: Response) {
    if (!req.body.id) {
      return Result.fail(400, 'Bad Request');
    }
    if(!(await this.verifyIfUserIsAdmin(req.body.current_user_id, req.body.list_id))){
      return Result.fail(401, 'Unauthorized');
    }
    return this.listUserRepository.deleteListUser(req.body.id);
  }
}
