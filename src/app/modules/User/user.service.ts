import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TChangePassword, TLoginUser, TUser } from './user.interface';
import { User } from './user.model';
import { createToken } from './user.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import QueryBuilder from '../../builder/QueryBuilder';
import { USER_ROLE } from './user.constant';

const createUserInDB = async (payload: TUser) => {
  console.log(payload);

  // check is email exist in db
  const isEmailExist = await User.isUserExistByEmail(payload.email);
  console.log(isEmailExist, 'hello exist');
  if (isEmailExist) {
    // if email exist, throw error
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email already exist');
  }

  const result = await User.create(payload);
  if (!result) {
    // if user not created, throw error
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create user',
    );
  }

  const jwtPayload = {
    email: result?.email,
    role: result?.role as string,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwtAccess as string,
    config.jwtAccessExpireIn as string,
  );
  return { accessToken };
};

const loginUserInDB = async (payload: TLoginUser) => {
  // check is email exist in db
  const user = await User.isUserExistByEmail(payload.email);
  console.log(user, 'user');
  if (!user) {
    // if email not exist, throw error
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not exist');
  }
  // check is password correct
  const isPasswordCorrect = await User.isPasswordMatched(
    payload.password,
    user.password,
  );
  if (!isPasswordCorrect) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }

  // is user block
  const isUserBlocked = user?.isBlocked;
  if (isUserBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked');
  }

  // generate token
  const jwtPayload = {
    email: user.email,
    role: user.role as string,
  };

  console.log(jwtPayload);
  const accessToken = createToken(
    jwtPayload,
    config.jwtAccess as string,
    config.jwtAccessExpireIn as string,
  );
  console.log(accessToken);
  return { accessToken };
};

const changePasswordIntoDB = async (
  payload: TChangePassword,
  user: JwtPayload,
) => {
  console.log(payload, user);

  // check is password correct

  // check is user exist
  const isUser = await User.isUserExistByEmail(user?.email);
  if (!isUser) {
    // if user not exist, throw error
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not exist');
  }

  const isPasswordCorrect = await User.isPasswordMatched(
    payload.oldPassword,
    isUser.password,
  );
  if (!isPasswordCorrect) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt),
  );

  const result = await User.findOneAndUpdate(
    { email: user.email, role: user.role },
    { password: newHashedPassword, passwordChangedAt: new Date() },
    { new: true },
  );

  console.log(result);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update password');
  }
  return result;
};
// check is user exist in db

const getAllUserInDB = async (query: Record<string, unknown>) => {
  const searchTerm = ['name'];

  const userBuilder = new QueryBuilder(User.find().select('-password'), query)
    .search(searchTerm)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await userBuilder.modelQuery;
  const meta = await userBuilder.countTotal();

  return { result, meta };
};

const makeAnAdminIntoDB = async (userId: string, user: JwtPayload) => {
  console.log(userId);
  const isUserExist = await User.findOne({ _id: userId });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }
  console.log(isUserExist);
  // check block or not
  if (isUserExist.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is blocked');
  }

  // check is Admin
  if (user?.role !== 'admin') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not admin');
  }
  const result = await User.findByIdAndUpdate(userId, {
    $set: { role: 'admin' },
  });
  if (result) {
    result.password = '';
  }
  return result;
};

const changeBlockStatusIntoDB = async (userId: string, user: JwtPayload) => {
  console.log(userId);
  const isUserExist = await User.findOne({ _id: userId });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  console.log(user.role);
  // check is Admin
  if (user?.role !== USER_ROLE.admin) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not admin');
  }
  //admin can't block an admin
  if (isUserExist.role === USER_ROLE.admin) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Admin can't block an admin");
  }
  console.log(user?.email, isUserExist.email, '----------');

  if (user?.email === isUserExist.email) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You can not block yourself');
  }

  const result = await User.findByIdAndUpdate(userId, {
    $set: { isBlocked: !isUserExist.isBlocked },
  });
  if (result) {
    result.password = '';
  }
  return result;
};
const deleteUserFromDB = async (userId: string, user: JwtPayload) => {
  const isUserExist = await User.findOne({ _id: userId });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  // check is Admin
  if (user?.role !== USER_ROLE.admin) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not admin');
  }
  //admin can't block an admin
  if (isUserExist.role === USER_ROLE.admin) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Admin can't delete an admin");
  }

  if (user?.email === isUserExist.email) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You can not delete yourself');
  }

  const result = await User.findByIdAndDelete(userId);

  return result;
};

export const UserServices = {
  createUserInDB,
  loginUserInDB,
  changePasswordIntoDB,
  makeAnAdminIntoDB,
  getAllUserInDB,
  changeBlockStatusIntoDB,
  deleteUserFromDB,
};
