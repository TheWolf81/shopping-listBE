import {Request, Response, NextFunction} from 'express';
import {Result} from '../utils/Result';
import {ListItemRepository} from '../repositories/ListItemRepository';
import {ListUserRepository} from '../repositories/ListUserRepository';
import {Status} from '../enum/Status';

export class ListItemController {
  private listItemRepository: ListItemRepository;
  private listUserRepository: ListUserRepository;

  constructor() {
    this.listItemRepository = new ListItemRepository();
    this.listUserRepository = new ListUserRepository();
  }

  async verifyIfUserIsAdminOrOwner(user_id: number, list_id: number) {
    const user = await this.listUserRepository.findListUserByUserIdAndListId(user_id, list_id);
    console.log(user);
    if (!user) {
      return false;
    }
    return user.role === 'admin' || user.role === 'owner';
  }

  async verifyIfUserIsMember(user_id: number, list_id: number) {
    const user = await this.listUserRepository.findListUserByUserIdAndListId(user_id, list_id);
    return !!user;
  }

  async verifyIfUserMadeListing(user_id: number, id: number) {
    const listItem = await this.listItemRepository.findListItemById(id);
    if (!listItem) {
      return false;
    }
    return listItem.user_id === user_id;
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
    if(!(await this.verifyIfUserIsMember(req.body.user_id, req.body.list_id))){
      return Result.fail(401, 'Unauthorized');
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
    //check if user didnt make the listing and isnt admin
    if((await this.verifyIfUserMadeListing(req.body.user_id, req.body.id)) || (await this.verifyIfUserIsAdminOrOwner(req.body.user_id, req.body.list_id))){
      return this.listItemRepository.deleteListItem(req.body.id);
    }
    return Result.fail(401, 'Unauthorized: not the creator of this listing');
  }
  
  async toggleListItemStatus(req: Request, res: Response) {
    if (!req.body.id) {
      return Result.fail(400, 'Bad Request');
    }
    var listItem = await this.listItemRepository.findListItemById(req.body.id);
    if(!listItem){
      return Result.fail(404, 'Item not found');
    }
    if(listItem.status === Status.listed){
    return this.listItemRepository.changeItemStatus(
      req.body.id,
      Status.acquired
    );
  }
  return this.listItemRepository.changeItemStatus(
    req.body.id,
    Status.listed
  );
  }

  async deleteCheckedItemsInList(req: Request, res: Response) {
    var items = await this.listItemRepository.findCheckedItemsInList(req.body.list_id);
    if(items.data.length == 0){
      return Result.fail(400, 'No items to clear');
    }
    if (!req.body.list_id) {
      return Result.fail(400, 'Bad Request');
    }
    if(!(await this.verifyIfUserIsAdminOrOwner(req.body.user_id, req.body.list_id))){
      return Result.fail(401, 'Unauthorized');
    }
    return this.listItemRepository.deleteCheckedItemsFromList(req.body.list_id);
  }

  async updateListItem(req: Request, res: Response) {
    if (!req.body.id) {
      return Result.fail(400, 'Bad Request');
    }
    if(!req.body.name && !req.body.unit && !req.body.quantity){
      return Result.fail(400, 'Bad Request');
    }
    console.log(req.body);
    const madeListing = await this.verifyIfUserMadeListing(req.body.user_id, req.body.id);
    const isAdminOrOwner = await this.verifyIfUserIsAdminOrOwner(req.body.user_id, req.body.list_id);
    console.log(madeListing);
    console.log(isAdminOrOwner);
    if((await this.verifyIfUserMadeListing(req.body.user_id, req.body.id)) || (await this.verifyIfUserIsAdminOrOwner(req.body.user_id, req.body.list_id))){
      const listItem ={
        name: req.body.name,
        unit: req.body.unit,
        quantity: req.body.quantity,
      }
      return this.listItemRepository.updateListItem(req.body.id, listItem);
    }
    return Result.fail(401, 'Unauthorized: not the creator of this listing');
    
  }

  async getAllItemsInList(req: Request, res: Response) {
    const list_id = req.params.list_id;
    if (!list_id) {
      return Result.fail(400, 'Bad Request');
    }
    return this.listItemRepository.findItemsInList(parseInt(list_id));
  }
  
  async getItemById(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return Result.fail(400, 'Bad Request');
    }
    const result = await this.listItemRepository.findListItemById(parseInt(id));
    return Result.success(result);
  }
}
