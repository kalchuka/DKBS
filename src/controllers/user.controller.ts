import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { User ,Role} from '../models/users.model';
import { ApiResponse } from '../utils/apiResponse';


const NewUserService = new UserService();

export const create = (req: Request, res: Response,  next: NextFunction): void => {
    const userData: User = req.body;

    if (!req.userDetail) {
        return ApiResponse.error(res, "Unauthorized", 401);
    }
    if(req.userDetail.role !== Role.Admin) {
        return ApiResponse.error(res, "You do not have permission to create users", 403);
    }

    if (!userData) {
        return ApiResponse.error(res, "User data must be provided", 400);
    }
if (typeof userData !== 'object' || Array.isArray(userData)) {
        return ApiResponse.error(res, "User data must be an object", 400);
    }

    if (!userData.email || !userData.name) {
        return ApiResponse.error(res, "Email and name must be provided", 400);
    }
    
    if (typeof userData.email !== 'string' || typeof userData.name !== 'string') {
        return ApiResponse.error(res, "Email and name must be strings", 400);
    }

    if (userData.role && !Object.values(Role).includes(userData.role as Role)) {
        return ApiResponse.error(res, "Role must be one of Admin, Editor, or Viewer",400);
    }
       try {
    const createdUser = NewUserService.createUserService(userData);
    if ('error' in createdUser) {
        return ApiResponse.error(res, `Username ${userData.email} already exists`,400);
    }
    return ApiResponse.success(res, createdUser, 'User created succesfully');
       } catch (error) {
    next(error);
}
};



export const getByEmail = (req: Request, res: Response): void => {
    const userId = req.params.email;
  const user = NewUserService.getByEmailService(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return
  }
  ApiResponse.success(res, user, 'Users found');
};


export const update = (req: Request, res: Response): void => {
    const userId = req.params.email;
  const updated = NewUserService.updateUserService(userId, req.body);
  if (!updated) {
    res.status(404).json({ message: 'User not found' });
    return
  }
  res.json(updated);
};
