import { z } from 'zod';

const ProductValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name cannot be empty' }),
  brand: z.string().min(1, { message: 'brand is require' }),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
    message:
      'Category must be one of the following: Mountain, Road, Hybrid, Electric',
  }),
  description: z.string(),
  quantity: z.number().min(0, 'Quantity must be a positive number'),
  inStock: z.boolean().default(true),
});

export default ProductValidationSchema;
