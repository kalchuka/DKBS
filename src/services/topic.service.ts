/**
 * Topic Service
 * This service handles the business logic for topics, including creation, updating, retrieval, and deletion.
 * It interacts with the repository layer to perform database operations.
 * It also provides methods to build topic trees and find paths between topics.
 * * @module services/topic.service
  * @author Chuka <kalchuka@gmail.com>
 */

import { Topics,Resource, TopicWithChildren } from '../models/topics.model';
import { createTopic,getTopicbyId,getAllTopicsRepo,getChildren,deleteTopic} from '../repositories/topic.repositoriee';
import { TopicFactory } from '../factories/topic.factory';
import { nanoid } from 'nanoid';
import { generateTopicId } from '../utils/randomNo';

export class TopicService {

constructor() {

}

  /**
   * Creates a new topic.
   * @param {Topics} topic - The topic to create.
   * @returns {Topics | { error: string }} - The created topic or an error object.
   */
  createTopicService(topic: Topics): Topics | { error: string }{
    if(topic.parentTopicId !== undefined) {
return { error: 'Creating a topic with parent is not allowed' };
    }
    const newTopic = TopicFactory.create(
      generateTopicId(8),
        topic.name,
        topic.content,
        topic.createdBy,
        nanoid(),
        topic.resources,
    );
    return createTopic(newTopic);
  }

  /**
   * Updates an existing topic.
   * @param {string} topicId - The ID of the topic to update.
   * @param {string} newContent - The new content for the topic.
   * @param {Resource[] | undefined} resources - Optional resources to associate with the topic.
   * @param {string} updatedBy - The user who is updating the topic.
   * @returns {Topics | { error: string }} - The updated topic or an error object.
   */
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
        nanoid(),
        resources,
      );
    return createTopic(newTopic);
  }

  /**
   * Retrieves all topics, optionally filtered by a specific topic ID.
   * @param {any} topicId - Optional topic ID to filter by.
   * @returns {TopicWithChildren[] | TopicWithChildren | null} - An array of topics with children, a single topic with children, or null if no topics found.
   */

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
  
  /**
   * Builds a tree structure of topics with their children.
   * @param {Topics[]} topics - An array of top-level topics.
   * @returns {TopicWithChildren[]} - An array of topics with their children structured as a tree.
   */
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
  
  /**
   * Builds a tree structure for a single topic and its children.
   * @param {Topics} rootTopic - The root topic to build the tree from.
   * @returns {TopicWithChildren} - The root topic with its children structured as a tree.
   */

   buildTopicTree(rootTopic: Topics): TopicWithChildren {
    const children = getChildren(rootTopic.topicId);
    const childTrees = children.map(child => this.buildTopicTree(child));
  
    return {
      ...rootTopic,
      children: childTrees,
    };
  }

  /**
   * Deletes a topic by its ID.
   * @param {string} topicId - The ID of the topic to delete.
   * @returns {boolean} - Returns true if the topic was successfully deleted.
   * @throws {Error} - Throws an error if the topic with the given ID does not exist.
   */

  deleteTopicService(topicId: string): boolean {
    const topicIdNumber = Number(topicId);
    const existingTopic = getTopicbyId(topicIdNumber);
    if (!existingTopic) {
      throw new Error(`Topic with ID ${topicId} not found`);
    }
    deleteTopic(topicIdNumber);
    return true;
  }


  /**
   * Finds the shortest path between two topics in the topic tree.
   * @param {number} startId - The ID of the starting topic.
   * @param {number} endId - The ID of the ending topic.
   * @param {Topics[]} topics - An array of all topics to search within.
   * @returns {Topics[] | null} - An array of topics representing the path from start to end, or null if no path exists.
   */

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

  /**
 * Finds the path from a given node to the root of the topic tree.
 * @param {number} nodeId - The ID of the node to start from.
 * @param {Map<number, Topics>} topicMap - A map of all topics for fast lookup.
 * @returns {Topics[]} - An array of topics representing the path from the node to the root.
 */

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


