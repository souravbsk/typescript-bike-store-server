import { z } from 'zod';

const createValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name cannot be empty' }),
    brand: z.string().min(1, { message: 'brand is require' }),
    price: z.number().min(0, 'Price must be a positive number'),
    model: z.enum(['mountain', 'road', 'hybrid', 'electric'], {
      message:
        'Category must be one of the following: Mountain, Road, Hybrid, Electric',
    }),
    description: z.string().optional(),
    stock: z.number().min(0, 'Quantity must be a positive number'),
    inStock: z.boolean().default(true),
    image_url: z.string().optional(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    price: z.number().min(0, 'Price must be a positive number').optional(),
    model: z
      .enum(['mountain', 'road', 'hybrid', 'electric'], {
        message:
          'Category must be one of the following: Mountain, Road, Hybrid, Electric',
      })
      .optional(),
    description: z.string().optional(),
    stock: z.number().optional(),
    image_url: z.string().optional(),
  }),
});

export const ProductValidationSchema = {
  createValidationSchema,
  updateProductValidationSchema,
};
