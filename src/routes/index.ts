import { Router } from 'express';
import userRoutes from './user.routes';
import topicRoutes from './topic/topic.route';
import { authCheck } from '../middleware/authCheck';

const router = Router();

router.use('/user',authCheck, userRoutes);
router.use('/topic', authCheck,topicRoutes);

export default router;