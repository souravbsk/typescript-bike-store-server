import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createRegister = catchAsync(async (req: Request, res: Response) => {
  const { accessToken } = await UserServices.createUserInDB(req.body);
  if (accessToken) {
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'User created successfully',
      data: { accessToken },
      success: true,
    });
  }
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { accessToken } = await UserServices.loginUserInDB(req.body);
  if (accessToken) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'User logged in successfully',
      data: { accessToken },
      success: true,
    });
  }
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;

  const result = await UserServices.changePasswordIntoDB(req.body, user);

  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Password changed successfully',
      data: null,
      success: true,
    });
  }
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUserInDB(req?.query);
  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Users retrieved successfully',
      data: result?.result,
      meta: result?.meta,
      success: true,
    });
  }
});

const makeAnAdmin = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const userId = req.params.id;

  const result = await UserServices.makeAnAdminIntoDB(userId, user);
  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Admin created successfully',
      data: null,
      success: true,
    });
  }
});

const changeBlockStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const userId = req.params.id;
  const result = await UserServices.changeBlockStatusIntoDB(userId, user);
  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Block status changed successfully',
      data: null,
      success: true,
    });
  }
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const userId = req.params.id;
  const result = await UserServices.deleteUserFromDB(userId, user);
  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'user Deleted successfully',
      data: null,
      success: true,
    });
  }
});

export const UserControllers = {
  createRegister,
  loginUser,
  changePassword,
  makeAnAdmin,
  getAllUser,
  changeBlockStatus,
  deleteUser,
};
