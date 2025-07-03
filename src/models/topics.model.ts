export interface Version {
    content: string;
    timestamp: Date;
    updatedBy: string;
    versionNumber: number;
    isCurrent: boolean;
    linkedResourceIds: string[];
    linkedTopicIds: string[];
  }
  
  export interface Topic {
    id: number;
    title: string;
    content: string;
    writenby: string;
    versions: Version[];
    linkedTopicIds: string[];
    linkedResourceIds: string[];
  }