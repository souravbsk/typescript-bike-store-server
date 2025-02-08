import { Types } from 'mongoose';

export type TOrder = {
  email: string;
  product: Types.ObjectId;
  totalPrice: number;
  quantity: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'paid' | 'unpaid';
  tran_id: string;
};
