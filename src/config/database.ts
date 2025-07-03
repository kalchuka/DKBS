import Loki from 'lokijs';
import { Topic } from '../models/topics.model';
import { User } from '../models/users.model'

const db = new Loki('kb.json', {
  autoload: true,
  autosave: true,
  autosaveInterval: 1,
  autoloadCallback: databaseInitialize,
});

function databaseInitialize() {

    if (!db.getCollection<User>('users')) {
        db.addCollection<User>('users', { unique: ['id'] });
      }

    if (!db.getCollection<Topic>('topics')) {
      db.addCollection<Topic>('topics', { unique: ['id'] });
    }
   
  }

export default db;