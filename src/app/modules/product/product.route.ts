import express, { NextFunction, Request, Response } from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidationSchema } from './product.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { multerUpload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  multerUpload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data);
    req.body.image_url = req.file?.path;
    next();
  },
  validateRequest(ProductValidationSchema?.createValidationSchema),
  ProductControllers.createProduct,
);
router.get('/', ProductControllers.getAllProduct);
router.get('/:productId', ProductControllers.getProductById);
router.patch(
  '/:productId',
  auth(USER_ROLE.admin),
  multerUpload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data);
    req.body.image_url = req.file?.path;
    next();
  },
  validateRequest(ProductValidationSchema.updateProductValidationSchema),
  ProductControllers.updateProductById,
);
router.delete(
  '/:productId',
  auth(USER_ROLE.admin),
  ProductControllers.deleteProductById,
);
export const ProductRoutes = router;
