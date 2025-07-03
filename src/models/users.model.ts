
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
export type Role = 'Admin' | 'Editor' | 'Viewer';
