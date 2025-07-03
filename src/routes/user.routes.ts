import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authCheck ,adminAuthCheck} from '../middleware/authCheck';
const router = Router();

router.post('/', adminAuthCheck,userController.create);
router.put('/', authCheck, userController.update);
router.get('/',authCheck, userController.getByEmail);

export default router;