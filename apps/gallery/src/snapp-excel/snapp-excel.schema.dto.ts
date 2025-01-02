import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SnappHotelReservation extends Document {
  @Prop({ required: true, unique: true })
  reservationNumber: number;

  @Prop({ required: true })
  hotel: string;

  @Prop({ required: true })
  reservationDate: Date;

  @Prop({ required: true })
  checkInOutDate: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  finalPrice: number;
}

export const SnappHotelReservationSchema = SchemaFactory.createForClass(
  SnappHotelReservation
);
