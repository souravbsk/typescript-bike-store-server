import QueryBuilder from '../../builder/QueryBuilder';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (productData: TProduct) => {
  const newProduct = await Product.create(productData);
  const result = await newProduct.save();
  return result;
};

const getAllProductFromDB = async (query: Record<string, unknown>) => {
  const searchTerm = ['name', 'brand', 'model'];
  console.log(query);

  const productQueryBuilder = new QueryBuilder(Product.find(), query)
    .search(searchTerm)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await productQueryBuilder.modelQuery;
  const meta = await productQueryBuilder.countTotal();

  return { result, meta };
};

const getProductByIdFormDB = async (id: string) => {
  const result = await Product.findById({ _id: id });
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
};

const updateProductByIdInDB = async (id: string, productData: TProduct) => {
  if (productData.stock && productData.stock > 0) {
    productData.inStock = true;
  } else {
    productData.inStock = false;
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
