import {Request, Response, NextFunction} from 'express';
import {Result} from '../utils/Result';
import {UserRepository} from '../repositories/UserRepository';
import {User} from '../types';
import {hash, compare} from 'bcrypt';

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  verifyParams(req: Request) {
    if (!req.body.nickname || !req.body.password) {
      return false;
    }
    return true;
  }

  hashPassword(password: string) {
    return hash(password, 10);
  }

  verifyPassword(enteredPassword: string, storedHash: string) {
    return compare(enteredPassword, storedHash);
  }

  async createUser(req: Request) {
    if (!this.verifyParams(req)) {
      return Result.fail(400, 'Bad Request');
    }
    req.body.password = await this.hashPassword(req.body.password);
    return this.userRepository.createUser(req.body);
  }

  async deleteUser(req: Request, res: Response) {
    if (!req.body.id || !req.body.password) {
      return Result.fail(400, 'Bad Request');
    }
    return this.userRepository.deleteUser(req.body.id, req.body.password);
  }

  async getAllUsers() {
    const users = await this.userRepository.getAll();
    if (users.length > 0) {
      return Result.success(users);
    }
    return Result.fail(404, 'No users found');
  }

  async getUserById(req: Request) {
    if (!req.params.id) {
      return Result.fail(400, 'Bad Request');
    }
    const user = await this.userRepository.findUserById(
      parseInt(req.params.id)
    );
    if (user) {
      return Result.success(user);
    }
    return Result.fail(404, 'User not found');
  }

  async loginUser(req: Request) {
    if (!req.body.nickname || !req.body.password) {
      return Result.fail(400, 'Bad Request');
    }
    return this.userRepository.loginUser(req.body as User);
  }
}
