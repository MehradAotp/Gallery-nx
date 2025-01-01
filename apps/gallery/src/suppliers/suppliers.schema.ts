import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Suppliers extends Document {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  datalidAccount: string;

  createdAt: Date;
}
export const suppliersSchema = SchemaFactory.createForClass(Suppliers);
