import { Topics,Resource } from '../models/topics.model';
import { createTopic,getTopicbyId,getAllTopicsRepo} from '../repositories/topic.repositoriee';
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

        console.log(`Updating topic with ID: ${topicIdNumber}`);
        console.log('The new topic',newTopic);

    return createTopic(newTopic);
  }

  getAllTopics(topicId:any): Topics[] | null {

    switch (topicId) {
      case undefined:
        return getAllTopicsRepo();
      default:
        const topic = getTopicbyId(topicId);
        console.log(topic);
        
        return topic ? [topic] : null;
    }
  }  }

