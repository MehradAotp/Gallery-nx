import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { StatusEnum } from './dto/photo.dto';
import mongooseAutopopulate from 'mongoose-autopopulate';
import { Category } from '../category/category.schema';
import { User } from '../users/users.schema';

@Schema()
export class PhotoDocument extends Document {
  @Prop({ required: true })
  filename: string;
  @Prop({ required: true })
  title: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }],
    required: true,
    autopopulate: true,
  })
  categories: Category[];
  @Prop({ required: false })
  description?: string;
  @Prop({
    required: true,
    enum: StatusEnum,
    default: StatusEnum.PENDING,
    type: String,
  })
  status: StatusEnum;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    autopopulate: true,
  })
  uploadedBy: User; //mongoose.Schema.Types.ObjectId to User
}

export const PhotoSchema = SchemaFactory.createForClass(PhotoDocument);
PhotoSchema.plugin(mongooseAutopopulate);
export interface PhotoPopulatedDocument
  extends Omit<PhotoDocument, 'uploadedBy' | 'categories'> {
  uploadedBy: User;
  categories: Category[];
}
