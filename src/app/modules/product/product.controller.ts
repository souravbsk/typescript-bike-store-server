 
import { Request, Response } from 'express';
import { ProductServices } from './product.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const productData = req.body;

  console.log(productData);
  console.log(req?.file);
  const result = await ProductServices.createProductIntoDB(productData);

  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Product created successfully',
      success: true,
      data: result,
    });
  }
});

// get all product
const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getAllProductFromDB(req.query);
  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Bikes retrieved successfully',
      success: true,
      data: result?.result,
      meta: result?.meta,
    });
  }
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.productId;
  const result = await ProductServices.getProductByIdFormDB(id);
  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Bikes retrieved successfully',
      success: true,
      data: result,
    });
  }
});

const updateProductById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.productId;
  const productBody = req.body;

  const result = await ProductServices.updateProductByIdInDB(id, productBody);

  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Bikes updated successfully',
      success: true,
      data: result,
    });
  }
});

const deleteProductById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.productId;
  const result = await ProductServices.deleteProductByIdInDB(id);
  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Bikes deleted successfully',
      success: true,
      data: result,
    });
  }
});

export const ProductControllers = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
