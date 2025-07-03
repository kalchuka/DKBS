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
export function authCheck(req: Request, res: Response, next: NextFunction) {
    

    const userEmail = req.headers['email'] as string;
    if (userEmail == "" || !userEmail) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = userService.getByEmailService(userEmail);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
   
    req.userDetail = user; 
    next();
}