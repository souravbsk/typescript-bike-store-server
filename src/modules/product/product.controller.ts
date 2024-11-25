/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import ProductValidationSchema from './product.validation';
import { ZodError } from 'zod';
import { ProductServices } from './product.service';

const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    const productParseData = ProductValidationSchema.parse(productData);

    // console.log(productParseData, 'parse data');

    const result = await ProductServices.createProductIntoDB(productParseData);

    if (result) {
      res.status(200).json({
        message: 'Bike created successfully',
        success: true,
        data: result,
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
      res.status(404).json({
        success: false,
        message: error.message || 'Something went to wrong',
        error: error,
        stack: error.stack,
      });
    }
  }
};

// get all product
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;

    const result = await ProductServices.getAllProductFromDB(
      searchTerm as string,
    );
    if (result) {
      res.status(200).json({
        message: 'Bikes retrieved successfully',
        status: true,
        data: result,
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
      res.status(404).json({
        success: false,
        message: error.message || 'Something went to wrong',
        error: error,
        stack: error.stack,
      });
    }
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.productId;
    const result = await ProductServices.getProductByIdFormDB(id);
    if (result) {
      res.status(200).json({
        message: 'Bike retrieved successfully',
        status: true,
        data: result,
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
      res.status(404).json({
        success: false,
        message: error.message || 'Something went to wrong',
        error: error,
        stack: error.stack,
      });
    }
  }
};

const updateProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.productId;
    const productBody = req.body;

    const result = await ProductServices.updateProductByIdInDB(id, productBody);

    if (result) {
      res.status(200).json({
        message: 'Bike updated successfully',
        status: true,
        data: result,
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
      res.status(404).json({
        success: false,
        message: error.message || 'Something went to wrong',
        error: error,
        stack: error.stack,
      });
    }
  }
};

const deleteProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.productId;
    const result = await ProductServices.deleteProductByIdInDB(id);
    if (result) {
      res.status(200).json({
        message: 'Bike deleted successfully',
        status: true,
        data: {},
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
      res.status(404).json({
        success: false,
        message: error.message || 'Something went to wrong',
        error: error,
        stack: error.stack,
      });
    }
  }
};

export const ProductControllers = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
