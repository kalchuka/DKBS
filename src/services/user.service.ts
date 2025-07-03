import { User } from '../models/users.model';
import {
    createUser,
    getUserByEmail,
    updateUser,
} from '../repositories/users.repositories';

export class UserService {
  createUserService(user: User): User |{ error: string }{
    //const existingUser = getUserByEmail(user.email);
     // if (existingUser) {
        //return { error: `User with email ${user.email} already exists` };
     // }
    return createUser(user);
  }

  getByEmailService(email: string): User | null {
    return getUserByEmail(email);
  }

  updateUserService(email: string, updateFields: Partial<User>): User | null {
    return updateUser(email, updateFields);
  }

}