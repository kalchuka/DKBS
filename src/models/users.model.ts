
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export type Role = 'Admin' | 'Editor' | 'Viewer';
