import { Topics,Resource, TopicWithChildren } from '../models/topics.model';
import { createTopic,getTopicbyId,getAllTopicsRepo,getChildren} from '../repositories/topic.repositoriee';
import { TopicFactory } from '../factories/topic.factory';
import { nanoid } from 'nanoid';
import { generateTopicId } from '../utils/randomNo';

export class TopicService {

constructor() {
}
  createTopicService(topic: Topics): Topics | { error: string }{
    const newTopic = TopicFactory.create(
      generateTopicId(8),
        topic.name,
        topic.content,
        topic.createdBy,
        topic.parentTopicId,
        topic.resources
    );
    return createTopic(newTopic);
  }

  updateTopicService(topicId: string,
    newContent: string,
    resources: Resource[] | undefined,
    updatedBy: string
): Topics | { error: string }{

  const topicIdNumber = Number(topicId);
    const existingTopic = getTopicbyId(topicIdNumber);
    if (!existingTopic) {
        return { error: `Topic with ID ${topicId} not found` };
      }
      
    const newTopic = TopicFactory.createNewVersion( 
        existingTopic,
        newContent,
        updatedBy,
        generateTopicId(8),
        resources
      );
    return createTopic(newTopic);
  }

    getAllTopics(topicId?: any): TopicWithChildren[] | TopicWithChildren | null {
    if (topicId === undefined) {
      // Fetch all top-level topics as forest
      const topics = getAllTopicsRepo();
      if (!topics) {
        return null;
      }
      return this.buildTopicAllTrees(topics);
    } else {
      const rootTopic = getTopicbyId(topicId);
      if (!rootTopic) {
        return null;
      }
      return this.buildTopicTree(rootTopic);
    }
  }
  
   buildTopicAllTrees(topics: Topics[]): TopicWithChildren[] {
    const buildTree = (topic: Topics): TopicWithChildren => {
      const children = getChildren(topic.topicId);
      const childTrees = children.map(child => buildTree(child));
      return {
        ...topic,
        children: childTrees,
      };
    };
  
    return topics.map(topic => buildTree(topic));
  }
  
   buildTopicTree(rootTopic: Topics): TopicWithChildren {
    const children = getChildren(rootTopic.topicId);
    const childTrees = children.map(child => this.buildTopicTree(child));
  
    return {
      ...rootTopic,
      children: childTrees,
    };
  }

}


