import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TransactionDocument extends Document {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true, unique: true })
  referenceNo: string;

  @Prop()
  details?: string;

  @Prop()
  ticketNo?: string;

  @Prop()
  passengerName?: string;

  @Prop()
  invoice: number;

  @Prop()
  markup: number;

  @Prop()
  commission: number;

  @Prop()
  debit: number;

  @Prop()
  credit: number;

  @Prop()
  runningBalance: number;
}

export const TransactionSchema =
  SchemaFactory.createForClass(TransactionDocument);
