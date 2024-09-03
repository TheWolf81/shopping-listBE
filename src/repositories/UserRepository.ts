import {db} from '../database';
import {Result} from '../utils/Result';
import {UserUpdate, User, NewUser} from '../types';
import {compare} from 'bcrypt';

export class UserRepository {
  constructor() {}

  async findUserById(id: number) {
    return await db
      .selectFrom('user')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async findUserByNickname(nickname: string) {
    return await db
      .selectFrom('user')
      .where('nickname', '=', nickname)
      .selectAll()
      .executeTakeFirst();
  }

  async findUsers(criteria: Partial<User>) {
    let query = db.selectFrom('user');

    if (criteria.id) {
      query = query.where('id', '=', criteria.id); // Kysely is immutable, you must re-assign!
    }

    if (criteria.nickname) {
      query = query.where('nickname', '=', criteria.nickname);
    }
    return await query.selectAll().execute();
  }

  async updateUser(id: number, updateWith: UserUpdate) {
    await db.updateTable('user').set(updateWith).where('id', '=', id).execute();
  }

  async createUser(user: NewUser) {
    const result = await this.findUsers({nickname: user.nickname});
    if (result.length > 0) {
      return Result.fail(400, 'Nickname already in use');
    }
    try {
      await db
        .insertInto('user')
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow();
      return Result.success('User created successfully');
    } catch (error: any) {
      if (error.code === '23505') {
        return Result.fail(400, 'User already exists');
      } else {
        return Result.fail(500, 'Internal Server Error');
      }
    }
  }

  async deleteUser(id: number, password: string) {
    const user = await this.findUserById(id);
    if (user && (await compare(password, user.password)))
      try{
      await db.deleteFrom('user').where('id', '=', id).execute();
      return Result.success('User deleted successfully');
      } catch (error: any) {
        console.log(error);
        return Result.fail(500, 'Internal Server Error');
      }
    else if (user) return Result.fail(401, 'Incorrect password');
    else return Result.fail(404, 'User not found');
  }

  async getAll() {
    return await db.selectFrom('user').selectAll().orderBy('nickname', 'asc').execute();
  }

  async loginUser(user: User) {
    const result = await this.findUserByNickname(user.nickname);
    if (result && (await compare(user.password, result.password)))
      return Result.success(result);
    else if (result) return Result.fail(401, 'Incorrect password');
    else return Result.fail(404, 'User not found');
  }
}
