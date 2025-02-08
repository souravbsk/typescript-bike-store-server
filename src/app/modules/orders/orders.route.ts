import express from 'express';
import { orderControllers } from './orders.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidationSchema } from './orders.validation';

const router = express.Router();

router.post(
  '/create-order',
  auth(USER_ROLE.customer),
  validateRequest(OrderValidationSchema.CreateOrderValidationSchema),
  orderControllers.createOrder,
);

router.get('/revenue', orderControllers.getRevenue);

router.get('/', orderControllers.getAllOrders);

router.post('/success/:tran_id', orderControllers.getSuccessOrder);
router.post('/fail/:tran_id', orderControllers.getFailOrder);
router.post('/cancel/:tran_id', orderControllers.getCancelOrder);

router.patch(
  '/:order_id/order-status-change',
  auth(USER_ROLE.admin),
  validateRequest(OrderValidationSchema.updateOrderStatusValidationSchema),
  orderControllers.changeOrderStatus,
);

router.delete(
  '/:order_id',
  auth(USER_ROLE.admin),
  orderControllers.deleteOrder,
);
export const OrderRoutes = router;
