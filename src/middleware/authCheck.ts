import {Request, Response, NextFunction} from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/users.model';


declare global {
    namespace Express {
      interface Request {
        userDetail?: User;
      }
    }
  }
  
const userService = new UserService();
export function authCheck(req: Request, res: Response, next: NextFunction): void {
    const api_key = req.headers['api_key'] as string;
    if (api_key == "" || !api_key) {
         res.status(401).json({ message: 'Unauthorized' });
         return
    }

    const user = userService.getByEmailService(api_key);


    if (!user) {
         res.status(401).json({ message: 'Unauthorized' });
         return
    }
   
    req.userDetail = user; 
    next();
}


export function adminAuthCheck(req: Request, res: Response, next: NextFunction): void {
    
    const api_key = req.headers['api_key'] as string;
    if (api_key == "" || !api_key) {
         res.status(401).json({ message: 'Unauthorized' });
         return
    }
    const user = userService.getByEmailService(api_key);
    // log user for debugging
    if (user?.role !== 'SuperAdmin') {
         res.status(403).json({ message: 'Forbidden' });
         return
    }
    if (!user) {
         res.status(401).json({ message: 'Unauthorized' });
         return
    }
   
    req.userDetail = user; 
    next();
}