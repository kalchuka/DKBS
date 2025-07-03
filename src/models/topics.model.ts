export interface Topic {
  id: number;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  createdBy: string; // not in challange docs but i am adding to track who created the topic
  parentTopicId?: number; 
  linkedTopicIds?: string[];
  linkedResourceIds?: string[];
}

export interface Resource {
  id: number;
  topicId: number;
  url: string;
  description: string;
  type: ResourceType;
  createdAt: Date;
  updatedAt: Date;
}

export type ResourceType = 'Video' | 'Article' | 'Pdf' | 'Image' | 'Audio';

