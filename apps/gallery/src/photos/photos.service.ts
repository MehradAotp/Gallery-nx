import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PhotoDocument, PhotoPopulatedDocument } from './photos.schema';
import { Model, Types } from 'mongoose';
import { CreatePhotoDto } from './dto/createPhoto.dto';
import { PhotoDto } from './dto/photo.dto';
import { Category } from '../category/category.schema';
import { EventsService } from '../events/events.service';
import { User } from '../users/users.schema';

interface UserForDisplay {
  _id: Types.ObjectId;
  username: string;
  role: 'admin' | 'user';
  email: string;
}
@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(PhotoDocument.name) private photoModel: Model<PhotoDocument>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly eventsService: EventsService
  ) {}

  async createPhoto(
    createPhotoDto: CreatePhotoDto,
    userId: string,
    filename: string
  ): Promise<PhotoDto> {
    const categoryIds = createPhotoDto.categories;
    const categories = await this.categoryModel
      .find({ _id: { $in: categoryIds } })
      .exec();

    // بررسی اینکه تعداد رکوردهای پیدا شده برابر با تعداد شناسه‌ها باشد
    if (categories.length !== categoryIds.length) {
      throw new BadRequestException('One or more category IDs are invalid.');
    }
    const createdPhoto = new this.photoModel({
      ...createPhotoDto,
      uploadedBy: userId,
      filename,
    });

    const savedPhoto = await createdPhoto.save();
    const photoWithDetails = await this.photoModel
      .findById(savedPhoto._id)
      .exec();
    return this.mapToPhotoDto(photoWithDetails);
  }

  async allApprovedPhoto(): Promise<PhotoDto[]> {
    const photos = await this.photoModel.find({ status: 'approved' }).exec();
    
    return photos.map(this.mapToPhotoDto);
  }

  async getUserPhotos(userId: string): Promise<PhotoDto[]> {
    const photos = await this.photoModel.find({ uploadedBy: userId }).exec();

    return photos.map(this.mapToPhotoDto);
  }

  async findPendingPhotos(): Promise<PhotoDto[]> {
    const photos = await this.photoModel.find({ status: 'pending' }).exec();

    return photos.map(this.mapToPhotoDto);
  }

  async approvePhoto(photoId: string): Promise<PhotoDto> {
    const doc = await this.photoModel
      .findByIdAndUpdate(photoId, { status: 'approved' }, { new: true })
      .exec();
    if (doc) {
      const user = doc.uploadedBy as User; // Cast to User
      const username = user.username; // دریافت نام کاربری
      const email = user.email; // دریافت ایمیل

      await this.eventsService.publishPhotoApprovedEvent(
        photoId,
        username, // ارسال نام کاربری به جای ID
        email
      );
      console.log('Publishing message:', { photoId, username, email });
    }

    return this.mapToPhotoDto(doc);
  }

  async rejectPhoto(photoId: string): Promise<PhotoDto> {
    const doc = await this.photoModel
      .findByIdAndUpdate(photoId, { status: 'rejected' }, { new: true })
      .exec();
    if (doc) {
      const user = doc.uploadedBy as User; // Cast to User
      const username = user.username; // دریافت نام کاربری
      const email = user.email; // دریافت ایمیل

      await this.eventsService.publishPhotoRejectedEvent(
        photoId,
        username, // ارسال نام کاربری به جای ID
        email
      );
    }
    return this.mapToPhotoDto(doc);
  }

  async displayPhoto(photoId: string, user: UserForDisplay): Promise<PhotoDto> {
    const photo = await this.photoModel.findById(photoId);
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }
    const isOwnerOrAdmin =
      user.role === 'admin' ||
      (photo.uploadedBy._id as Types.ObjectId).equals(user._id);

    if (!isOwnerOrAdmin && photo.status !== 'approved') {
      throw new NotFoundException('Photo is not available');
    }
    return this.mapToPhotoDto(photo);
  }
  async displayPhotoForAll(photoId: string, user: UserForDisplay): Promise<PhotoDto> {
    const photo = await this.photoModel.findById(photoId);
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.status !== 'approved') {
      throw new NotFoundException('Photo is not available');
    }
    return this.mapToPhotoDto(photo);
  }
  async infoPhoto(photoId: string, user: UserForDisplay): Promise<PhotoDto> {
    const photo = await this.photoModel.findById(photoId);
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }
    const isOwnerOrAdmin =
      user.role === 'admin' ||
      (photo.uploadedBy._id as Types.ObjectId).equals(user._id);

    if (!isOwnerOrAdmin && photo.status !== 'approved') {
      throw new NotFoundException('Photo is not available');
    }
    return this.mapToPhotoDto(photo);
  }

  //change schema to DTO
  private mapToPhotoDto(photo: PhotoPopulatedDocument): PhotoDto {
    const { _id, filename, title, description, status, uploadedBy } = photo;
    const categories = photo.categories ?? [];

    return {
      id: _id?.toString() || 'unknown',
      filename,
      title,
      categories: categories.map(({ _id, name }) => ({
        id: _id?.toString() || 'unknown',
        name: name || 'unknown',
      })),
      description,
      status,
      uploadedBy: {
        id: uploadedBy?._id?.toString() || 'unknown',
        username: uploadedBy?.username || 'unknown',
      },
    };
  }
}
