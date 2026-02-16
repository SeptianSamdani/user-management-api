import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  toggleUserStatus,
} from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateUserSchema } from '../validators/auth.validator';
import { Role } from '../types';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize(Role.ADMIN));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', validate(updateUserSchema), updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', changeUserRole);
router.patch('/users/:id/status', toggleUserStatus);

export default router;