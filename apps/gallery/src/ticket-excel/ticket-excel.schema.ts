import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TicketFlight extends Document {
  @Prop({ required: true })
  rowNumber: number;

  @Prop({ required: true, unique: true })
  purchaseSerial: string;

  @Prop({ required: true })
  buyer: string;

  @Prop({ required: true })
  ticketCount: number;

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  flightNumber: string;

  @Prop({ required: true })
  flightDate: Date;

  @Prop({ required: true })
  seller: string;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  airline: string;

  @Prop({ required: true })
  reservationTime: Date;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  saleType: string;

  @Prop({ required: true })
  saleProfit: number;

  @Prop({ required: true })
  memberCommission: number;

  @Prop({ required: true })
  buyerType: string;

  @Prop({ required: true })
  flightType: string;

  @Prop({ required: true })
  buyerMobile: string;

  @Prop({ required: true })
  purchaseAmount: number;

  @Prop({ required: true })
  sellerWebsite: string;
}
export const TicketFlightSchema = SchemaFactory.createForClass(TicketFlight);
