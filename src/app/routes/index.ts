import { Router } from 'express';
import { ProductRoutes } from '../modules/product/product.route';
import { OrderRoutes } from '../modules/orders/orders.route';
import { userRoutes } from '../modules/User/user.routes';
// application routes
const router = Router();
const moduleRoutes = [
  {
    path: '/products',
    router: ProductRoutes,
  },
  {
    path: '/orders',
    router: OrderRoutes,
  },
  {
    path: '/users',
    router: userRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
