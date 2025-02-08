import { z } from 'zod';

const CreateOrderValidationSchema = z.object({
  body: z.object({
    product: z.string(),
    quantity: z.number().int().positive(),
    totalPrice: z.number().min(0, 'Total Price must be a positive number'),
    email: z.string().email(),
    status: z
      .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .default('pending'),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z
      .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .default('pending'),
  }),
});

export const OrderValidationSchema = {
  CreateOrderValidationSchema,
  updateOrderStatusValidationSchema,
};
