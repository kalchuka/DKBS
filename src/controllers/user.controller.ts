import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/users.model';
import { ApiResponse } from '../utils/apiResponse';


const NewUserService = new UserService();

export const create = (req: Request, res: Response,  next: NextFunction): void => {
    const userData: User = req.body;

    if (!userData.email || !userData.name) {
        return ApiResponse.error(res, "Email and name must be provided", 400);
    }
    
    if (typeof userData.email !== 'string' || typeof userData.name !== 'string') {
        return ApiResponse.error(res, "Email and name must be strings", 400);
    }

    if (userData.role && !['Admin', 'Editor', 'Viewer'].includes(userData.role)) {
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
