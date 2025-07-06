import db from '../config/database';
import { User } from '../models/users.model';

function getUsersRepo() {
  let users = db.getCollection<User>('users');
  if (!users) {
    users = db.addCollection<User>('users', { unique: ['email'] });    
  }
  return users;
}

export function createUser(user: User): User {
  const users = getUsersRepo();
  users.insert(user);
  db.saveDatabase();
  return user;
}

export function getUserByEmail(email: string): User | null {
  const users = getUsersRepo();
  return users.findOne({ email }) || null;
}

export function getAllUsers(): User[] | null {
  const users = getUsersRepo();
  const allUsers = users.find();
  
  return allUsers
}

export function updateUser(email: string, updateFields: Partial<User>): User | null {
  const users = getUsersRepo();
  const user = users.findOne({ email });

  if (!user) {
    return null;
  }

  Object.assign(user, updateFields);
  users.update(user);
  db.saveDatabase();
  return user;
}
