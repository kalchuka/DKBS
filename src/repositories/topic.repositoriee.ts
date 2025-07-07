/**
 * * @file topic.repositoriee.ts
 * * @description This file contains the repository functions for managing topics in the database.
 * * It includes functions to create, retrieve, update, and delete topics.
 * * @module repositories/topic.repositoriee
 * @author Chuka <kalchuka@gmail.com>
 */
import db from '../config/database';
import { Topics } from '../models/topics.model';

function TopicDb() {
  let topicsConnect = db.getCollection<Topics>('topics');
  if (!topicsConnect) {
    topicsConnect = db.addCollection<Topics>('topics', { unique: ['topicId'] });
  }
  return topicsConnect;
}

export function createTopic(topic: Topics): Topics {
  const topicRepo = TopicDb();
  topicRepo.insert(topic);
  db.saveDatabase();
  return topic;
}

export function getTopicbyId(topicId: number): Topics | null{
    const topicRepo = TopicDb();
    return topicRepo.findOne({topicId:Number(topicId)});
  }

  export function getAllTopicsRepo(): Topics[] | null{
    const topicRepo = TopicDb();
    return topicRepo.find() || null;
  }

  export function getChildren(topicId: number): Topics[] {
    const topicRepo = TopicDb();
    return topicRepo.find({ parentTopicId: topicId });
  }

  export function deleteTopic(topicId: number): boolean {
    const topicRepo = TopicDb();
   const deleteTopic = topicRepo.findAndRemove({ topicId: topicId });
      db.saveDatabase();
      return true;
  }

