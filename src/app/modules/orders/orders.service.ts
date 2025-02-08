 
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TOrder } from './orders.interface';
import { Order } from './orders.model';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../User/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../product/product.model';
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import { v4 as uuidv4 } from 'uuid';

const createOrderIntoDB = async (
  orderPayload: TOrder,
  userPayload: JwtPayload,
) => {
  // is email exist
  const user = await User.isUserExistByEmail(userPayload?.email);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (user?.email !== userPayload?.email) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to create order',
    );
  }

  // is block
  if (user?.isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked');
  }

  if (!orderPayload?.product) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Order must have products');
  }

  console.log(orderPayload, userPayload);

  // feetc product
  const product = await Product.findById(orderPayload?.product);

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  // check product quantity
  if (product?.stock < orderPayload?.quantity) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Product quantity is not enough',
    );
  }
  // create order

  // trxId:
  const tran_id = uuidv4();

  const orderData: TOrder = {
    email: userPayload?.email,
    product: orderPayload?.product,
    quantity: orderPayload?.quantity,
    status: 'pending',
    totalPrice: product?.price * orderPayload?.quantity,
    payment_status: 'unpaid',
    tran_id: tran_id,
  };

  console.log(orderData);
  const order = await Order.create(orderData);
  console.log(order);

  const sslData = {
    total_amount: orderPayload?.totalPrice,
    currency: 'BDT',
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `${config.server_url as string}/orders/success/${tran_id}`,
    fail_url: `${config.server_url as string}/orders/fail/${tran_id}`,
    cancel_url: `${config.server_url as string}/orders/cancel/${tran_id}`,
    ipn_url: `${config.server_url as string}/orders/ipn/${tran_id}`,
    shipping_method: 'Courier',
    product_name: product?.name,
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: orderPayload?.email,
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(
    config.store_id,
    config.store_pass,
    false,
  );

  const res = await sslcz.init(sslData);
  const gatewayPageURL = res?.GatewayPageURL;
  // const products = orderPayload.product;

  return { url: gatewayPageURL };
};

const getSuccessOrderFromDB = async (tran_id: string) => {
  console.log(tran_id);
  const order = await Order.findOneAndUpdate(
    {
      tran_id,
    },
    {
      $set: {
        payment_status: 'paid',
      },
    },
  );

  if (order) {
    const updatedProduct = await Product.findByIdAndUpdate(
      order?.product,
      {
        $inc: {
          stock: -order?.quantity,
        },
      },
      { new: true },
    );
    if (updatedProduct && updatedProduct?.stock <= 0) {
      console.log('Stock is empty, updating isStock status.');
      console.log(updatedProduct, 'hello wolf');
      await Product.findByIdAndUpdate(order?.product, { inStock: false });
    }
  }

  return order;
  // return order;
};

const getFailOrderFromDB = async (tran_id: string) => {
  console.log(tran_id);
  const order = await Order.findOneAndDelete({
    tran_id,
  });

  console.log(order, 'order');
  return order;
  // return order;
};
const getCancelOrderFromDB = async (tran_id: string) => {
  console.log(tran_id);
  const order = await Order.findOneAndDelete({
    tran_id,
  });

  console.log(order, 'order');
  return order;
  // return order;
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

const getAllOrdersFromDB = async (payload: Record<string, unknown>) => {
  const searchTerm = ['email', 'tran_id'];

  const orderQueryBuilder = new QueryBuilder(
    Order.find().populate('product'),
    payload,
  )
    .search(searchTerm)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await orderQueryBuilder.modelQuery;
  const meta = await orderQueryBuilder.countTotal();

  return { result, meta };
};

const changeOrderStatusFromDB = async (
  order_id: string,
  payload: Record<string, unknown>,
) => {
  console.log(payload, 'fsdf');
  const order = await Order.findByIdAndUpdate(
    order_id,
    { status: payload },
    {
      new: true,
    },
  );
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  console.log(order);
  return order;
};
const deleteOrderFromDB = async (order_id: string) => {
  const order = await Order.findByIdAndDelete(order_id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  return order;
};

export const OrderService = {
  createOrderIntoDB,
  getRevenueFromDB,
  getAllOrdersFromDB,
  getSuccessOrderFromDB,
  getFailOrderFromDB,
  getCancelOrderFromDB,
  changeOrderStatusFromDB,
  deleteOrderFromDB,
};
