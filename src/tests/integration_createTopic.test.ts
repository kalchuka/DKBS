import request from 'supertest';
import app from '../app';
import db from '../config/database';
import { Topics } from '../models/topics.model';
import { User, Role } from '../models/users.model';

describe('Topic Controller Integration', () => {
  const TEST_API_KEY = "emeka@example.com";
  
  beforeAll(() => {
    let usersCollection = db.getCollection<User>('users');
    if (!usersCollection) {
      usersCollection = db.addCollection<User>('users', { unique: ['email'] });
    }
    
    const testUser = usersCollection.findOne({ email: TEST_API_KEY });
    if (!testUser) {
      usersCollection.insert({
        name: 'Test User',
        email: TEST_API_KEY,
        role: 'Admin', 
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Created test user:', TEST_API_KEY);
    }
    
    db.saveDatabase();
  });
  
  beforeEach(() => {
    let usersCollection = db.getCollection<User>('users');
    if (usersCollection) {
      console.log('Available users before test:', 
        usersCollection.find().map(u => ({ email: u.email, role: u.role }))
      );
    } else {
      console.warn('Users collection not found');
    }
    
    let topicsCollection = db.getCollection<Topics>('topics');
    if (!topicsCollection) {
      topicsCollection = db.addCollection<Topics>('topics', { unique: ['topicId'] });
    }
    topicsCollection.clear();
  });

  it('should create a topic via POST and then retrieve it via GET', async () => {
    const newTopic = {
      name: 'Integration Test Topic',
      content: 'Test content',
      createdBy: 'testUser',
    };

    const createRes = await request(app)
      .post('/api/topic')
      .send(newTopic)
      .set('x-api-key', TEST_API_KEY) 
      .expect(200);

    expect(createRes.body.data.name).toBe(newTopic.name);
    expect(createRes.body.data.createdBy).toBe(newTopic.createdBy);
    const topicId = createRes.body.data.topicId;

    const getRes = await request(app)
      .get(`/api/topic/${topicId}`)
      .set('x-api-key', TEST_API_KEY) 
      .expect(200);

    expect(getRes.body.data.topicId).toBe(topicId);
    expect(getRes.body.data.name).toBe(newTopic.name);
  });

  it('should return 404 for non-existing topic', async () => {
    await request(app)
      .get('/api/topic/99999')
      .set({
        'x-api-key': TEST_API_KEY,
      }) 
      .expect(404);
  });
  

});