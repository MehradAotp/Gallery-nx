import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FlightTransaction extends Document {
  @Prop({ required: true })
  rowNumber: number;

  @Prop({ required: true, unique: true })
  saleSerial: string;

  @Prop({ required: true })
  airlineName: string;

  @Prop({ required: true })
  route: string;

  @Prop({ required: true })
  flightNumber: string;

  @Prop({ required: true })
  PNR: string;

  @Prop({ required: true })
  passengerName: string;

  @Prop({ required: true })
  saleDate: Date;

  @Prop({ required: true })
  purchasePrice: number;

  @Prop({ required: true })
  salePrice: number;

  @Prop({ required: true })
  agentProfit: number;

  @Prop({ required: true })
  saleType: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  memberId: number;
}

export const FlightTransactionSchema =
  SchemaFactory.createForClass(FlightTransaction);
