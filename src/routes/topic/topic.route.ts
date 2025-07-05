import { Router } from 'express';
import * as topicController from '../../controllers/topic.controller';
const router = Router();

router.post('/',topicController.creatTopic);
router.put('/:topicId', topicController.creatTopic);
router.get('/', topicController.getTopic);
router.get('/:topicId', topicController.getTopic);

export default router;