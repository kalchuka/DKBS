import db from '../config/database';
import { TopicPermissions } from '../models/permision.model';

export function getPermissionByRole(role: string): TopicPermissions | null {
  const permissions = db.getCollection<TopicPermissions>('permissions');
  if (!permissions){
    throw new Error(`Permissions collection not found in the database.`);
  }
  return permissions.findOne({ role:'Admin' }) || null;
}