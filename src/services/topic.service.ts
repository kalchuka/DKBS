import { Topics,Resource, TopicWithChildren } from '../models/topics.model';
import { createTopic,getTopicbyId,getAllTopicsRepo,getChildren,deleteTopic} from '../repositories/topic.repositoriee';
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

  deleteTopicService(topicId: string): boolean {
    const topicIdNumber = Number(topicId);
    const existingTopic = getTopicbyId(topicIdNumber);
    if (!existingTopic) {
      throw new Error(`Topic with ID ${topicId} not found`);
    }
    deleteTopic(topicIdNumber);
    return true;
  }




   findShortestPath(startId: number, endId: number, topics: Topics[]): Topics[] | null {
    // Map all topics by id for fast lookup
    const topicMap = new Map<number, Topics>();
    for (const topic of topics) {
      topicMap.set(topic.topicId, topic);
    }
    // Check if both start and end topics exist
    if (!topicMap.has(startId) || !topicMap.has(endId)) {
      return null;
    }
    // Get paths from both nodes to the root
    const pathStart = this.findPathToRoot(startId, topicMap);
    const pathEnd = this.findPathToRoot(endId, topicMap);
  
    if (!pathStart.length || !pathEnd.length) {
      return null;
    }
  
    const visited = new Set<number>(pathEnd.map(t => t.topicId));
    let commonAncestor: Topics | undefined;
  
    for (const node of pathStart) {
      if (visited.has(node.topicId)) {
        commonAncestor = node;
        break;
      }
    }
  
    if (!commonAncestor) {
      return null;
    }
  
    const upPath: Topics[] = [];
    for (const node of pathStart) {
      upPath.push(node);
      if (node.topicId === commonAncestor.topicId) {
        break;
      }
    }
  
    const downPath: Topics[] = [];
    for (const node of pathEnd) {
      if (node.topicId === commonAncestor.topicId) {
        break;
      }
      downPath.push(node);
    }
  
    const fullPath = [...upPath.reverse(), ...downPath];
  
    return fullPath;
  }

   findPathToRoot(nodeId: number, topicMap: Map<number, Topics>): Topics[] {
  const path: Topics[] = [];
  let current = topicMap.get(nodeId);

  while (current) {
    path.push(current);
    if (!current.parentTopicId) {
      break;
    }
    current = topicMap.get(current.parentTopicId);
  }

  return path;
}

}


