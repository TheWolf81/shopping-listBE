import {db} from '../database';
import {Result} from '../utils/Result';
import {ListItemUpdate, ListItem, NewListItem} from '../types';
import {Status} from '../enum/Status';

export class ListItemRepository {
  constructor() {}

  async findCheckedItemsInList(listId: number) {
    try {
      const result = await db
        .selectFrom('list_item')
        .where('list_id', '=', listId)
        .where('status', '=', Status.acquired)
        .selectAll()
        .orderBy('name', 'asc')
        .execute();
      return Result.success(result);
    } catch (error: any) {
      return Result.fail(400, error.message);
    }
  }
  async findListItemById(id: number) {
    return await db
      .selectFrom('list_item')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async findItemsInList(listId: number) {
    try {

      const result = await db
        .selectFrom('list_item')
        .where('list_id', '=', listId)
        .selectAll()
        .orderBy('name', 'asc')
        .execute();
      return Result.success(result);
    } catch (error: any) {
      return Result.fail(400, error.message);
    }
  }

  async updateListItem(id: number, updateWith: ListItemUpdate) {
    await db
      .updateTable('list_item')
      .set(updateWith)
      .where('id', '=', id)
      .execute();
    return Result.success('ListItem updated successfully');
  }

  async changeItemStatus(id: number, status: Status) {
    try {
      await db
        .updateTable('list_item')
        .set('status', status)
        .where('id', '=', id)
        .execute();
      return Result.success('ListItem status updated successfully');
    } catch (error: any) {
      return Result.fail(400, error.message);
    }
  }

  async createListItem(listItem: NewListItem) {
    try {
      const data = await db
        .insertInto('list_item')
        .values(listItem)
        .returningAll()
        .executeTakeFirstOrThrow();
      return Result.success(data);
    } catch (error: any) {
      return Result.fail(400, error.message);
    }
  }

  async deleteListItem(id: number) {
    if (!(await this.findListItemById(id))) {
      return Result.fail(400, 'ListItem does not exist');
    }
    await db.deleteFrom('list_item').where('id', '=', id).execute();
    return Result.success('ListItem deleted successfully');
  }

  async deleteItemsFromList(listId: number) {
    await db.deleteFrom('list_item').where('list_id', '=', listId).execute();
    return Result.success('All ListItems deleted successfully');
  }

  async deleteCheckedItemsFromList(listId: number) {
    try{
    await db
      .deleteFrom('list_item')
      .where('list_id', '=', listId)
      .where('status', '=', Status.acquired)
      .execute();
    return Result.success('Checked ListItems deleted successfully');
    } catch (error: any) {
      return Result.fail(400, error.message);
    }
  }

}
