import {Request, Response, NextFunction} from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/users.model';
import { ApiResponse } from '../utils/apiResponse';


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
     ApiResponse.error(res, 'Unauthorized', 401);
     return
    }

    const user = userService.getByEmailService(api_key);
    
    if (!user) {
     ApiResponse.error(res, 'Unauthorized', 401);
     return
       
    }
   
    req.userDetail = user; 
    next();
}


