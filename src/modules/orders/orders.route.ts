import express from 'express';
import { orderControllers } from './orders.controller';

const router = express.Router();

router.post('/', orderControllers.createOrder);
router.get('/revenue', orderControllers.getRevenue);

export const OrderRoutes = router;
