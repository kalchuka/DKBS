export interface TopicPermissions {
    role: string;      
    canCreate: boolean;
    canEdit: boolean;
    canView: boolean;
    canDelete: boolean;
    createdAt: Date;
    updatedAt: Date;
  }