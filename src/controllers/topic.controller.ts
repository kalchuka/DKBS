import { NextFunction, Request, Response } from 'express';
import { TopicService } from '../services/topic.service';
import { Topics } from '../models/topics.model';
import { ApiResponse } from '../utils/apiResponse';
import {PermissionStrategy} from '../permissionStrategy/permission';
import { request } from 'http';


const NewUTopicService = new TopicService();


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
    if (!fetchTopic || fetchTopic.length === 0) {
        return ApiResponse.error(res, 'Topic not found', 404);
    }
    return ApiResponse.success(res, fetchTopic, 'Topic fetched successfully');
       } catch (error) {
    next(error);
}
};