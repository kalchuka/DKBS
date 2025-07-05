import { TopicPermissions } from '../models/permision.model';
import { getPermissionByRole } from '../repositories/permision.repository';
import { ApiResponse } from '../utils/apiResponse';

export class PermissionStrategy {
  private permission: TopicPermissions;

  constructor(role: string) {
    const perm = getPermissionByRole(role);
    if (!perm) {
        throw new Error(`No permissions found for role: ${role}`);
    }
    this.permission = perm;
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