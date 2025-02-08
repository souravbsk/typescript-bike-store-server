export type TProduct = {
  name: string;
  brand: string;
  price: number;
  model: 'mountain' | 'road' | 'hybrid' | 'electric';
  description?: string;
  stock: number;
  inStock: boolean;
  image_url?: string;
};
