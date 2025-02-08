import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'admin';
  isBlocked: boolean;
  passwordChangedAt?: Date;
};

export type TLoginUser = Pick<TUser, 'email' | 'password'>;

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export interface UserModel extends Model<TUser> {
  isUserExistByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
