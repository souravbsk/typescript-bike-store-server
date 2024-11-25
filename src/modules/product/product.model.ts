import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true },
    brand: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Mountain', 'Road', 'Hybrid', 'Electric'],
    },
    description: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: 'text', brand: 'text', category: 'text' });

export const Product = model<TProduct>('Product', productSchema);
