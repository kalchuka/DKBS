/**
 * PermissionStrategy class to manage user permissions based on roles. 
 * It reads permissions from a JSON file and provides methods to check if a user can create, edit, delete, or view topics.
 * @module services/permission.strategy
 * @author Chuka <kalchuka@gmail.com>
 */
import path from 'path';
import fs from 'fs';
import { TopicPermissions } from '../models/permision.model';

export class PermissionStrategy {
  private permission: TopicPermissions;

  constructor(role: string) {
    const permissionsFilePath = path.join(__dirname, '..', '..', 'src/config/permisionsData.json');
        const permissionsData = fs.readFileSync(permissionsFilePath, 'utf8');
        const permissionsArray = JSON.parse(permissionsData) as Array<{ role: string }>;
        const userPermision = permissionsArray.filter((perm) => perm.role === role)[0];
        if (!userPermision) {
          throw new Error(`Permissions for role "${role}" not found.`);
        }
        this.permission = userPermision as TopicPermissions
  }
  canCreate() {
    return this.permission.canCreate;
  }
  canEdit() {
    return this.permission.canEdit;
  }
  canDelete() {
    return this.permission.canDelete;
  }
  canView() {
    return this.permission.canView;
  }
}