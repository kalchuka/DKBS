/* User Service 
  * This service handles user-related operations such as creating, retrieving, and updating users.
  * It interacts with the repository layer to perform database operations.
  * @module services/user.service
  * @
  */

import { User } from '../models/users.model';
import {
    createUser,
    getUserByEmail,
    updateUser,
    getAllUsers
} from '../repositories/users.repositories';


/**
 * User Service
 * This service handles user-related operations such as creating, retrieving, and updating users.
 * It interacts with the repository layer to perform database operations.
 * @module services/user.service
 */
export class UserService {


/**
 * 
 * @param user - The user object to create.
 * @returns 
 * { User | { error: string }} - The created user or an error object if the user already exists.
 * This method checks if a user with the same email already exists before creating a new user.
 * If a user with the same email exists, it returns an error object.
 * If the user is created successfully, it returns the created user object.
 * 
 */
  createUserService(user: User): User | { error: string }{
    const existingUser = getUserByEmail(user.email);
     if (existingUser) {
        return { error: `User with email ${user.email} already exists` };
     }
    return createUser(user);
  }

  /**
   * Retrieves a user by email or returns all users if email is undefined.
   * @param email - The email of the user to retrieve.
   * @returns {User | null | User[]} - The user object if found, null if not found, or an array of all users if email is undefined.
   */

  getByEmailService(email: string): User | null | User[] {
    if (email == undefined) {
const allUsers =  getAllUsers();
      return allUsers;
    }else {
      const user = getUserByEmail(email);
      return user;
    }
  }

  /**
   * Updates a user's information based on the provided email and update fields.
   * @param email - The email of the user to update.
   * @param updateFields - An object containing the fields to update.
   * @returns {User | null} - The updated user object if successful, or null if the user was not found.
   */
  updateUserService(email: string, updateFields: Partial<User>): User | null {
    return updateUser(email, updateFields);
  }

}