
export interface User {
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  Admin = 'Admin',
  Editor = 'Editor',
  Viewer = 'Viewer'
}