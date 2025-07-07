/**
 * Factory for creating and managing topics.
 * This factory provides methods to create new topics and new versions of existing topics.
 * It encapsulates the logic for initializing topic properties and managing resources.
 * @module factories/topic.factory
 * @author Chuka <kalchuka@gmail.com>
 */
import { Resource, Topics } from '../models/topics.model';

export class TopicFactory {

  /**
   * Creates a new topic with the provided details.
   * @param {number} topicId - The unique identifier for the topic.
   * @param {string} name - The name of the topic.
   * @param {string} content - The content of the topic.
   * @param {string} createdBy - The user who created the topic.
   * @param {string} version - The version of the topic.
   * @param {Resource[]} [resources] - Optional resources associated with the topic.
   * @returns {Topics} - The newly created topic object.
   */
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
   
  /**
   * Creates a new version of an existing topic.
   * @param {Topics} existingTopic - The existing topic to base the new version on.
   * @param {string} newContent - The new content for the topic.
   * @param {string} updatedBy - The user who is updating the topic.
   * @param {number} newTopicId - The unique identifier for the new topic version.
   * @param {string} version - The version identifier for the new topic.
   * @param {Resource[]} [resources] - Optional resources associated with the new topic version.
   * @returns {Topics} - The newly created topic version object.
   */
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