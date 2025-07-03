import { User } from '../models/users.model';
import {
    createUser,
    getUserByEmail,
    updateUser,
} from '../repositories/users.repositories';

export class UserService {
  createUserService(user: User): User {
    return createUser(user);
  }

  getByEmailService(email: string): User | null {
    return getUserByEmail(email);
  }

  updateUserService(email: string, updateFields: Partial<User>): User | null {
    return updateUser(email, updateFields);
  }

}