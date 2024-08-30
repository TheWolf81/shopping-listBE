import {db} from '../database';
import {Result} from '../utils/Result';
import {ListUpdate, List, NewList} from '../types';

export class ListRepository {
  constructor() {}

  async findListById(id: number) {

    const result = await db
      .selectFrom('list')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
      if(!result) {
        return Result.fail(400, 'List does not exist');
      }
    return Result.success(result);
  }

  async findLists(criteria: Partial<List>) {
    let query = db.selectFrom('list');

    if (criteria.id) {
      query = query.where('id', '=', criteria.id); // Kysely is immutable, you must re-assign!
    }

    if (criteria.title) {
      query = query.where('title', '=', criteria.title);
    }
    return await query.selectAll().execute();
  }

  async updateList(id: number, updateWith: ListUpdate) {
    try {
      await db.updateTable('list').set(updateWith).where('id', '=', id).execute();
      return Result.success('List updated successfully');
    }
    catch (error: any) {
      return Result.fail(400, error.message);
    }
  
  }

  async createList(list: NewList) {
    try {
      const data = await db
        .insertInto('list')
        .values(list)
        .returningAll()
        .executeTakeFirstOrThrow();
      return Result.success(data);
    } catch (error: any) {
      return Result.fail(400, error.message);
    }
  }

  async deleteList(id: number) {
    if (!(await this.findListById(id))) {
      return Result.fail(400, 'List does not exist');
    }
    await db.deleteFrom('list').where('id', '=', id).execute();
    return Result.success('List deleted successfully');
  }

  async getAll() {
    return await db.selectFrom('list').selectAll().execute();
  }
}
