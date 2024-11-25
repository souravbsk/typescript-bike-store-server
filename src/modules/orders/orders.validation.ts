import { z } from 'zod';

const OrderValidationSchema = z.object({
  email: z.string().email({ message: 'Email Required' }),
  product: z.string().min(1, { message: 'Please Insert a Product id' }),
  quantity: z.number().min(1, 'Quantity must be a positive number'),
  totalPrice: z.number().min(0, 'Total Price must be a positive number'),
});

export default OrderValidationSchema;
