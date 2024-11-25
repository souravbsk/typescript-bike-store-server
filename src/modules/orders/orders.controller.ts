/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import OrderValidationSchema from './orders.validation';
import { OrderService } from './orders.service';

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    const orderDataParse = OrderValidationSchema.parse(orderData);
    const orderResult = await OrderService.createOrderIntoDB(orderDataParse);

    if (orderResult) {
      res.status(200).json({
        message: 'Order created successfully',
        status: true,
        data: orderResult,
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

export const orderControllers = {
  createOrder,
  getRevenue,
};
