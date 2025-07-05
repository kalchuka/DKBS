import { TopicService } from '../services/topic.service';
import { createTopic, getTopicbyId, } from '../repositories/topic.repositoriee';
import { TopicFactory } from '../factories/topic.factory';
import { generateTopicId } from '../utils/randomNo';
import { nanoid } from 'nanoid';
// Mock dependencies
jest.mock('../../src/repositories/topic.repositoriee');
jest.mock('../../src/factories/topic.factory');
jest.mock('../../src/utils/randomNo');
jest.mock('nanoid');

describe('TopicService', () => {
describe('updateTopicService', () => {
    let topicService: TopicService;
    const mockTopicId = "22345543";
    const mockVersionId = 'mock-version-id';
    const mockNewContent = "Updated content";
    const mockUpdatedBy = "user1";
    
    const mockExistingTopic = {
      topicId: Number(mockTopicId),
      name: 'Test Topic',
      content: 'Original Content',
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 'old-version',
      resources: []
    };
    
    const mockUpdatedTopic = {
      topicId: Number(mockTopicId) + 1, 
      name: 'Test Topic',
      content: mockNewContent,
      createdBy: mockUpdatedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: mockVersionId,
      parentTopicId: Number(mockTopicId), 
      resources: []
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
      
      (generateTopicId as jest.Mock).mockReturnValue(Number(mockTopicId) + 1);
      (nanoid as jest.Mock).mockReturnValue(mockVersionId);
      
      const getTopicbyIdMock = jest.requireMock('../../src/repositories/topic.repositoriee').getTopicbyId;
      getTopicbyIdMock.mockReturnValue(mockExistingTopic);
      
      (TopicFactory.createNewVersion as jest.Mock).mockReturnValue(mockUpdatedTopic);
      
      (createTopic as jest.Mock).mockReturnValue(mockUpdatedTopic);
      
      topicService = new TopicService();
    });
  
    it('should update a topic successfully', () => {
      const result = topicService.updateTopicService(
        mockTopicId, 
        mockNewContent,
        [],  
        mockUpdatedBy
      );
      
      expect(getTopicbyId).toHaveBeenCalledWith(Number(mockTopicId));
      expect(generateTopicId).toHaveBeenCalledWith(8);
      expect(nanoid).toHaveBeenCalled();
      
      expect(TopicFactory.createNewVersion).toHaveBeenCalledWith(
        mockExistingTopic,        
        mockNewContent,          
        mockUpdatedBy,             
        Number(mockTopicId) + 1,   
        mockVersionId,             
        []                         
      );
      
      expect(createTopic).toHaveBeenCalledWith(mockUpdatedTopic);
      expect(result).toEqual(mockUpdatedTopic);
    });
  
    it('should return error if topic not found', () => {
      const getTopicbyIdMock = jest.requireMock('../../src/repositories/topic.repositoriee').getTopicbyId;
      getTopicbyIdMock.mockReturnValue(null);
      
      const result = topicService.updateTopicService(
        mockTopicId, 
        mockNewContent,
        [], 
        mockUpdatedBy
      );
      
      expect(result).toEqual({ error: `Topic with ID ${mockTopicId} not found` });
      expect(TopicFactory.createNewVersion).not.toHaveBeenCalled();
      expect(createTopic).not.toHaveBeenCalled();
    });
  });
});