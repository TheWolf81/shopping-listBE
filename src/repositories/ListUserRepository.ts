import {db} from '../database';
import {Result} from '../utils/Result';
import {ListUserUpdate, ListUser, NewListUser} from '../types';
import { Role } from '../enum/Role';

export class ListUserRepository {
  constructor() {}

  async findListUserById(id: number) {
    return await db
      .selectFrom('list_user')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async findListUserByUserIdAndListId(userId: number, listId: number) {
    return await db
      .selectFrom('list_user')
      .where('user_id', '=', userId)
      .where('list_id', '=', listId)
      .selectAll()
      .executeTakeFirst();
  }

  //intending to be used to show the users who share a list
  async listUsersInList(listId: number) {
    return await db
      .selectFrom('list_user')
      .where('list_id', '=', listId)
      .innerJoin('user', 'list_user.user_id', 'user.id')
      .selectAll()
      .execute();
  }

  //intending to be used to show the lists a user is a part of
  async listListsForUser(userId: number) {
    return await db
      .selectFrom('list_user')
      .where('user_id', '=', userId)
      .innerJoin('list', 'list_user.list_id', 'list.id')
      .selectAll()
      .orderBy('list.title', 'asc')
      .execute();
  }

  async updateListUserRole(id: number, role: Role) {
    try {
      await db
        .updateTable('list_user')
        .set('role', role)
        .where('id', '=', id)
        .execute();
      return Result.success('ListUser role updated successfully');
    } catch (error: any) {
      return Result.fail(400, error.message);
    }
  }

  async createListUser(listUser: NewListUser) {
    try {
      await db
        .insertInto('list_user')
        .values(listUser)
        .returningAll()
        .executeTakeFirstOrThrow();
      return Result.success('ListUser created successfully');
    } catch (error: any) {
      return Result.fail(400, error.message);
    }
  }

  async deleteListUser(id: number) {
    if (!(await this.findListUserById(id))) {
      return Result.fail(400, 'ListUser does not exist');
    }
    await db.deleteFrom('list_user').where('id', '=', id).execute();
    return Result.success('ListUser deleted successfully');
  }
}
