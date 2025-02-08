import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();
router.post(
  '/register',
  validateRequest(UserValidations.createUserValidation),
  UserControllers.createRegister,
);
router.post(
  '/login',
  validateRequest(UserValidations.loginValidation),
  UserControllers.loginUser,
);
router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  validateRequest(UserValidations.changePassword),
  UserControllers.changePassword,
);

router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUser);
router.patch(
  '/:id/make-admin',
  auth(USER_ROLE.admin),
  UserControllers.makeAnAdmin,
);

router.patch(
  '/:id/block',
  auth(USER_ROLE.admin),
  UserControllers.changeBlockStatus,
);
router.delete('/:id', auth(USER_ROLE.admin), UserControllers.deleteUser);

export const userRoutes = router;
