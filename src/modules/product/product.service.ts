import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (productData: TProduct) => {
  const newProduct = await Product.create(productData);
  const result = await newProduct.save();
  return result;
};

const getAllProductFromDB = async (searchTerm: string | undefined) => {
  let filter = {};
  if (searchTerm && typeof searchTerm === 'string') {
    filter = { $text: { $search: searchTerm } };
  }

  const result = await Product.find(filter);
  return result;
};

const getProductByIdFormDB = async (id: string) => {
  const result = await Product.findById({ _id: id });
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
};

const updateProductByIdInDB = async (id: string, productData: TProduct) => {
  if (productData.quantity && productData.quantity > 0) {
    productData.inStock = true;
    console.log('first');
  }

  const result = await Product.findByIdAndUpdate(id, productData, {
    new: true,
  });

  if (!result) {
    throw new Error('Product not found');
  }

  return result;
};

const deleteProductByIdInDB = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);

  if (!result) {
    throw new Error('Product not found');
  }

  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductFromDB,
  getProductByIdFormDB,
  updateProductByIdInDB,
  deleteProductByIdInDB,
};
