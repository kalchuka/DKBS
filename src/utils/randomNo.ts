import { v4 as uuidv4 } from 'uuid';

export function generateTopicId(x:number): number {
    const uuid = uuidv4().replace(/-/g, '');
    return parseInt(uuid.substring(0, x), 16);
  }