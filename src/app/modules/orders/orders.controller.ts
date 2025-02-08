/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { OrderService } from './orders.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const user = req.user;

  const orderResult = await OrderService.createOrderIntoDB(orderData, user);

  if (orderResult) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Order created successfully',
      data: orderResult,
      success: true,
    });
  }
});

const getRevenue = async (req: Request, res: Response) => {
  try {
    const revenue = await OrderService.getRevenueFromDB();
    if (revenue) {
      res.status(200).json({
        message: 'Revenue calculated successfully',
        status: true,
        data: revenue[0],
      });
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: {
          name: 'validationError',
          errors: error.issues,
        },
        stack: error.stack,
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'Something went to wrong',
        error: error,
      });
    }
  }
};

// const updateQuantity = catchAsync(async (req: Request, res: Response) => {
//   const { orderId } = req.params;

//   const { prooductId, quantity } = req.body;
// });

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await OrderService.getAllOrdersFromDB(req.query);
  if (orders) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Orders retrieved successfully',
      data: orders.result,
      success: true,
      meta: orders?.meta,
    });
  }
});

const getSuccessOrder = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.params;
  console.log(tran_id, 'helloe');
  const order = await OrderService.getSuccessOrderFromDB(tran_id);
  console.log(order, 'order');

  if (order) {
    res.redirect(`${config.domain}/order/trxId/${order?.tran_id}`);
  }
});

const getFailOrder = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.params;
  const order = await OrderService.getFailOrderFromDB(tran_id);

  res.redirect(`${config.domain}/order/fail/${order?.tran_id}`);
});
const getCancelOrder = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.params;
  const order = await OrderService.getCancelOrderFromDB(tran_id);

  res.redirect(`${config.domain}/order/fail/${order?.tran_id}`);
});
const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const { status } = req.body;
  console.log(status);
  const order = await OrderService.changeOrderStatusFromDB(order_id, status);
  if (order) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Order status updated successfully',
      data: order,
      success: true,
    });
  }
});
const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { order_id } = req.params;

  const order = await OrderService.deleteOrderFromDB(order_id);
  if (order) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Order status updated successfully',
      data: order,
      success: true,
    });
  }
});
export const orderControllers = {
  createOrder,
  getRevenue,
  getAllOrders,
  getSuccessOrder,
  getFailOrder,
  getCancelOrder,
  changeOrderStatus,
  deleteOrder,
};
