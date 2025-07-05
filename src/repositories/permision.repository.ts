import db from '../config/database';
import { TopicPermissions } from '../models/permision.model';

export function getPermissionByRole(role: string): TopicPermissions | null {
  const permissions = db.getCollection<TopicPermissions>('permissions');
  if (!permissions) return null;
  return permissions.findOne({ role }) || null;
}