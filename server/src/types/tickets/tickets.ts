import { Document } from 'mongoose';

export interface ITicket extends Document {
    title: string;
    description?: string;
    completed: boolean;
    created_at: Date;
  }