export interface Topics {
  topicId: number;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  createdBy: string; // not in challange docs but i am adding to track who created the topic
  parentTopicId?: number; 
  resources?: Resource[];
}

export interface Resource {
  url: string;
  description: string;
  type: ResourceType;
}

export interface TopicWithChildren extends Topics {
  children: TopicWithChildren[];
}

export type ResourceType = 'Video' | 'Article' | 'Pdf' | 'Image' | 'Audio';

