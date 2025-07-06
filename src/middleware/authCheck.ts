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
export   function authCheck(req: Request, res: Response, next: NextFunction): void {
  const api_key = req.headers['x-api-key'] as string;
  
    if (api_key == "" || !api_key) {
     ApiResponse.error(res, 'Unauthorized', 401);
     return
    }

  const user = userService.getByEmailService(api_key);
  
  if (!user || (Array.isArray(user) && user.length === 0)) {
      ApiResponse.error(res, 'Unauthorized', 401);
      return;
  }

  if (Array.isArray(user)) {
      req.userDetail = user[0]; // Assuming the first user in the array is the intended one
  } else {
      req.userDetail = user;
  }
  
  next();
}


