import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class IranHotel extends Document {
  @Prop({ required: true, type: Date })
  paymentDate: Date;
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, unique: true })
  paymentId: number;
  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  description: string;
}

export const IranHotelSchema = SchemaFactory.createForClass(IranHotel);
