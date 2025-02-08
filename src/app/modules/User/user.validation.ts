import { z } from 'zod';

const createUserValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email' }),
    password: z.string({ required_error: 'Password is required' }),
    role: z.enum(['admin', 'customer']).optional(),
  }),
});

export const loginValidation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email' })
      .optional(),
  }),
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required' }),
    newPassword: z.string({ required_error: 'New password is required' }),
  }),
});

export const UserValidations = {
  createUserValidation,
  updateUserValidation,
  loginValidation,
  changePassword,
};
