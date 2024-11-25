import { Product } from '../product/product.model';
import { TOrder } from './orders.interface';
import { Order } from './orders.model';

const createOrderIntoDB = async (orderData: TOrder) => {
  const stockResult = await Product.findOne({ _id: orderData.product });
  console.log(stockResult);
  if (!stockResult) {
    throw new Error('Product not found');
  }
  if (stockResult.quantity < orderData.quantity) {
    throw new Error('Not enough stock');
  }

  const newOrder = await Order.create(orderData);
  const result = await newOrder.save();

  const updateQuantity = stockResult.quantity - orderData.quantity;
  const inStock = updateQuantity > 0;

  await Product.findByIdAndUpdate(
    orderData.product,
    {
      quantity: updateQuantity,
      inStock: inStock,
    },
    {
      new: true,
    },
  );

  return result;
};

const getRevenueFromDB = async () => {
  // aggrigation pipeline for order sum value

  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  return result;
};

export const OrderService = {
  createOrderIntoDB,
  getRevenueFromDB,
};
