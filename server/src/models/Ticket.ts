import { Schema, model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { ITicket } from '../types';

const TicketSchema: Schema = new Schema<ITicket>({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
  });

TicketSchema.plugin(mongooseLeanVirtuals);

/**
 * @typedef Ticket
 */
export default model<ITicket>('Ticket', TicketSchema);
