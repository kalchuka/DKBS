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
  describe('createTopicService', () => {
    let topicService: TopicService;
    const mockTopicId = 12345;
    const mockVersionId = 'mock-version-id';
    const mockTopic = {
      name: 'Test Topic',
      content: 'Test Content',
      createdBy: 'user1',
      parentTopicId: undefined,
      resources: []
    };
    const mockCreatedTopic = {
      topicId: mockTopicId,
      name: 'Test Topic',
      content: 'Test Content',
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: mockVersionId,
      resources: []
    };

    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();
      
      // Setup mocks
      (generateTopicId as jest.Mock).mockReturnValue(mockTopicId);
      (nanoid as jest.Mock).mockReturnValue(mockVersionId);
      (TopicFactory.create as jest.Mock).mockReturnValue(mockCreatedTopic);
      (createTopic as jest.Mock).mockReturnValue(mockCreatedTopic);
      
      // Create service instance
      topicService = new TopicService();
    });

    it('should create a topic successfully', () => {
      // Act
      const result = topicService.createTopicService(mockTopic as any);
      
      // Assert
      expect(generateTopicId).toHaveBeenCalledWith(8);
      expect(nanoid).toHaveBeenCalled();
      expect(TopicFactory.create).toHaveBeenCalledWith(
        mockTopicId,
        mockTopic.name,
        mockTopic.content,
        mockTopic.createdBy,
        mockVersionId,
        mockTopic.resources
      );
      expect(createTopic).toHaveBeenCalledWith(mockCreatedTopic);
      expect(result).toEqual(mockCreatedTopic);
    });

    it('should pass through error from repository', () => {
      const errorMessage = 'Database error';
      (createTopic as jest.Mock).mockReturnValue({ error: errorMessage });
      
      const result = topicService.createTopicService(mockTopic as any);
      
      expect(result).toEqual({ error: errorMessage });
    });
    
    it('should not allow create to have parent id', () => {
        const topicWithParent = {
            ...mockTopic,
            parentTopicId: 1
        };
        
        const result = topicService.createTopicService(topicWithParent as any);
        
        expect(result).toEqual({ error: 'Creating a topic with parent is not allowed' });
      
    });
  });
});