/**
 * @file authCheck.ts
 * @description Middleware to check if the user is authenticated based on the API key.
 * This middleware checks the 'x-api-key' header and retrieves user details if valid.
 * If the API key is invalid or missing, it responds with a 401 Unauthorized status.
 * @module middleware/authCheck
 * This middleware is used to protect routes that require user authentication.
 * It checks the API key provided in the request headers and retrieves the user details from the UserService.
 * @author Chuka <kalchuka@gmail.com>
 */
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


