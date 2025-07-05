import { Resource, Topics } from '../models/topics.model';

export class TopicFactory {
  static create(
    topicId: number,
    name: string,
    content: string,
    createdBy: string,
    version: string,
    resources?: Resource[],
  ): Topics {
    const now = new Date();
    return {
      topicId,
      name,
      content,
      createdAt: now,
      updatedAt: now,
      version,
      createdBy,
      resources: resources || [],
    };
  }

  static createNewVersion(
    existingTopic: Topics,
    newContent: string,
    updatedBy: string,
    newTopicId: number,
    version: string,
    resources?: Resource[],
  ): Topics {
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