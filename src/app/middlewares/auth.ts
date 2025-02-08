import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/User/user.interface';
import catchAsync from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/User/user.model';

const auth = (...accessRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }
    console.log('hello world');
    //   valid check

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwtAccess as string) as JwtPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }
    const { email, role } = decoded;

    // check if user exist or not
    const user = await User.isUserExistByEmail(email);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found');
    }
    // check is user block
    if (user.isBlocked) {
      throw new AppError(StatusCodes.FORBIDDEN, 'User Blocked');
    }
    console.log(role, accessRoles);
    if (accessRoles && !accessRoles.includes(role)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
