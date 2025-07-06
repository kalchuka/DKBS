import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authCheck} from '../middleware/authCheck';
const router = Router();

router.post('/', authCheck,userController.create);
router.put('/:email', authCheck, userController.update);
router.get('/:email',authCheck, userController.getByEmail);
router.get('/',authCheck, userController.getByEmail);


export default router;