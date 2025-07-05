import { Resource, Topics } from '../models/topics.model';
import { nanoid } from 'nanoid';

export class TopicFactory {
  static create(
    topicId: number,
    name: string,
    content: string,
    createdBy: string,
    parentTopicId?: number,
    resources?: Resource[]
  ): Topics {
    const version = nanoid();
    const now = new Date();
    return {
      topicId,
      name,
      content,
      createdAt: now,
      updatedAt: now,
      version,
      createdBy,
      parentTopicId,
      resources: resources || [],
    };
  }

  static createNewVersion(
    existingTopic: Topics,
    newContent: string,
    updatedBy: string,
    newTopicId: number,
    resources?: Resource[]
  ): Topics {
    const version = nanoid();
    return {
      name: existingTopic.name,
      topicId: newTopicId, 
      content: newContent,
      version,
      updatedAt: new Date(),
      createdAt: new Date(),
      createdBy: updatedBy,
      parentTopicId: existingTopic.topicId,
      resources: resources || [],
    };
  }
}