import { Router } from 'express';
import { updateProfile, changePassword } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema, changePasswordSchema } from '../validators/auth.validator';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.put('/profile', validate(updateProfileSchema), updateProfile);
router.patch('/profile/password', validate(changePasswordSchema), changePassword);

export default router;