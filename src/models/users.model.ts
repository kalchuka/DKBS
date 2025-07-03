
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  api_key: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export type Role = 'Admin' | 'Editor' | 'Viewer';
