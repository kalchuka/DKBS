import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/users.model';


const NewUserService = new UserService();

export const create = (req: Request, res: Response) => {
    const userData: User = req.body;

    if (!userData.email || !userData.name) {
        return res.status(400).json({ message: 'Email and name are required' });
    }
  if (typeof userData.email !== 'string' || typeof userData.name !== 'string') {
    return res.status(400).json({ message: 'Email and name must be strings' });
  }

  if (userData.role && !['Admin', 'Editor', 'Viewer'].includes(userData.role)) {
    return res.status(400).json({ message: 'Role must be one of Admin, Editor, or Viewer' });
  }

  const createdUser = NewUserService.createUserService(userData);

  res.status(201).json(createdUser);
};


export const getByEmail = (req: Request, res: Response) => {
    const userId = req.params.email;
  const user = NewUserService.getByEmailService(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};


export const update = (req: Request, res: Response) => {
    const userId = req.params.email;
  const updated = NewUserService.updateUserService(userId, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(updated);
};
