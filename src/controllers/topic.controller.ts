/**
 * Topic Controller
 * @module controllers/topic.controller
 * @author Chuka <kalchuka@gmail.com>
 * This controller uses the TopicService to perform operations on topics.
 * It includes methods for creating, updating, retrieving, and deleting topics.
 */
import { NextFunction, Request, Response } from 'express';
import { TopicService } from '../services/topic.service';
import { Topics } from '../models/topics.model';
import { ApiResponse } from '../utils/apiResponse';
import {PermissionStrategy} from '../services/permission.strategy';
import { request } from 'http';
import { log } from 'console';


const NewUTopicService = new TopicService();

/**
 * Creates or updates a topic based on the request method.
 * If the method is POST, it creates a new topic.
 * If the method is PUT, it updates an existing topic.
 * @param {Request} req - The request object containing topic data.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 * @throws {Error} If an error occurs during topic creation or update.
 */
export const creatTopic = (req: Request, res: Response,  next: NextFunction): void => {
    const requestMethod = req.method
    let createdTopic: Topics | {error: string};
    const topicData: Topics = req.body;
    const permissions = new PermissionStrategy(req.userDetail?.role ?? '');


       try {
        ///
        switch (requestMethod) {
            case 'POST':
                if (!permissions.canCreate()) {
                    return ApiResponse.error(res, 'You do not have permission to create topics', 403);
                }
                 createdTopic = NewUTopicService.createTopicService(topicData);  
                if ('error' in createdTopic) {
                    return ApiResponse.error(res, createdTopic.error, 400);
                }
                break;
            case 'PUT':
                if (!permissions.canCreate()) {
                    return ApiResponse.error(res, 'You do not have permission to Edit topics', 403);
                }
                const topicId : string = req.params.topicId; 
                createdTopic = NewUTopicService.updateTopicService(topicId, topicData.content, topicData.resources, req.userDetail?.email || 'unknown');
                if ('error' in createdTopic) {
                    return ApiResponse.error(res, createdTopic.error, 400);
                }
                break;
            default:
                return ApiResponse.error(res, 'Method not allowed', 405);
        }
      
    return ApiResponse.success(res, createdTopic, 'Topic created successfully');
       } catch (error) {
    next(error);
}
};


/**
 * Retrieves a topic by its ID and all when Id is not provided.
 * @param {Request} req - The request object containing the topic ID in the parameters.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 * @throws {Error} If an error occurs during topic retrieval.
 */
export const getTopic = (req: Request, res: Response,  next: NextFunction): void => {
    const permissions = new PermissionStrategy(req.userDetail?.role ?? '');
    if (!permissions.canView()) {
        return ApiResponse.error(res, 'You do not have permission to view topics', 403);
    }
    const topicId = req.params.topicId;
       try {
        if (!permissions.canView()) {
            return ApiResponse.error(res, 'You do not have permission to Edit topics', 403);
        }
    const fetchTopic = NewUTopicService.getAllTopics(topicId);
    if (!fetchTopic) {
        return ApiResponse.error(res, 'Topic not found', 404);
    }
    
    const topicsArray = Array.isArray(fetchTopic) ? fetchTopic : [fetchTopic];
    const path = NewUTopicService.findShortestPath(6, 5, topicsArray);
    
    if (path) {
      console.log("Shortest Path IDs:", path.map(p => p.topicId));
    } else {
      console.log("No path found");
    }
    
    return ApiResponse.success(res, fetchTopic, 'Topic fetched successfully');
       } catch (error) {
    next(error);
}

};

/**
 * Deletes a topic by its ID.
 * @param {Request} req - The request object containing the topic ID in the parameters.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 * @throws {Error} If an error occurs during topic deletion.
 */
export const deleteTopic = (req: Request, res: Response,  next: NextFunction): void => {
    const permissions = new PermissionStrategy(req.userDetail?.role ?? '');
    if (!permissions.canDelete()) {
        return ApiResponse.error(res, 'You do not have permission to delete topics', 403);
    }
    const topicId = req.params.topicId;
       try {
    const deletedTopic = NewUTopicService.deleteTopicService(topicId);
    if (!deletedTopic) {
        return ApiResponse.error(res, 'Topic not found', 404);
    }
    return ApiResponse.success(res, deletedTopic, 'Topic deleted successfully');
       } catch (error) {
    next(error);
}
}