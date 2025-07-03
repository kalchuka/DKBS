import Loki from 'lokijs';
import { Topic } from '../models/topics.model';
import { User } from '../models/users.model'
import path from 'path';
import fs from 'fs';

const db = new Loki('kb.json', {
  autoload: true,
  autosave: true,
  autosaveInterval: 1,
  autoloadCallback: databaseInitialize,
});

function databaseInitialize() {
    let Users
    if (!db.getCollection<User>('users')) {
       Users =  db.addCollection<User>('users', { unique: ['id','email'] });
      } else{
         Users = db.getCollection<User>('users');
      }
    
      //Users.clear();
      /// log Users

      if (Users.count() === 0) {
      const adminFilePath = path.join(__dirname, 'adminUser.json');
      const adminUserData = fs.readFileSync(adminFilePath, 'utf8');
        if (!adminUserData) {
            throw new Error('Admin user data not found');
        }
      const adminUser = JSON.parse(adminUserData) as User;
            adminUser.createdAt = new Date(adminUser.createdAt);
      adminUser.updatedAt = new Date(adminUser.updatedAt);
      Users.insert(adminUser);
      db.saveDatabase();
    }

    if (!db.getCollection<Topic>('topics')) {
      db.addCollection<Topic>('topics', { unique: ['id'] });
    }
   
  }

export default db;