import Loki from 'lokijs';
import { Topics } from '../models/topics.model';
import { User } from '../models/users.model'
import { TopicPermissions } from '../models/permision.model';
import path from 'path';
import fs from 'fs';
import { ApiResponse } from '../utils/apiResponse';

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

    if (!db.getCollection<Topics>('topics')) {
      db.addCollection<Topics>('topics', { unique: ['topicId'] });
    }



    let Permisions
    // db.removeCollection('permisions');
    if (!db.getCollection<TopicPermissions>('permisions')) {
      Permisions =  db.addCollection<TopicPermissions>('permisions', { });
     } else{
        Permisions = db.getCollection<TopicPermissions>('permisions');
     }
     console.log('Permissions data:', Permisions);

     if (Permisions.count() === 0) {
     const permisionFilePath = path.join(__dirname, 'permisionsData.json');
     const permissionsData = fs.readFileSync(permisionFilePath, 'utf8');
       if (!permissionsData) {
        ApiResponse.error(
          { status: 500, json: (data: any) => console.error(data) },
          'Permissions data not found',
          500
        );
         return;
       }
       for (const permission of JSON.parse(permissionsData)) {
         const permisson: TopicPermissions = {
           ...permission,
           createdAt: new Date(permission.createdAt),
           updatedAt: new Date(permission.updatedAt),
         };
         Permisions.insert(permisson);
       }
     db.saveDatabase();
   }
   
  }

export default db;