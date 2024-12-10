import {
  Body,
  Controller,
  Post,
  Request,
  Get,
  Param,
  UseGuards,
  Response,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/createPhoto.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { toJalaali } from 'jalaali-js';
import { FormDataRequest } from 'nestjs-form-data';
import { PhotoDto } from './dto/photo.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photoService: PhotosService) {}
  //{Post} upload
  @Post('upload')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @FormDataRequest()
  async uploadPhoto(
    @Body() createPhotoDto: CreatePhotoDto,
    @Request() req: any
  ): Promise<PhotoDto> {
    // Save Photo And Change Name.
    // Date format as YYYY-MM-DD(Add Date Shamsi)
    const jalaaliDate = toJalaali(new Date());
    const dateFormat = `${jalaaliDate.jy}-${String(jalaaliDate.jm).padStart(
      2,
      '0'
    )}-${String(jalaaliDate.jd).padStart(2, '0')}`;
    const username = req.user.username;
    const fileExtension = path.extname(createPhotoDto.file.originalName); // Get the file extension
    const uniqueId = uuidv4();
    const newFileName = `${dateFormat}_${username}_${uniqueId}${fileExtension}`;

    const uploadPath = path.join(process.cwd(), 'apps', 'gallery', 'uploads', newFileName);
    console.log(uploadPath);
    // Create uploads directory if it doesn't exist
    try {
      await fs.mkdir(path.join(process.cwd(), 'apps', 'gallery', 'uploads'), { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }

    // Write file buffer to the destination
    await fs.writeFile(uploadPath, createPhotoDto.file.buffer);

    return this.photoService.createPhoto(
      createPhotoDto,
      req.user.id,
      newFileName
    );
  }
  //{GET} my-photos
  @Get('my-photos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async getUserPhotos(@Request() req: any) {
    return this.photoService.getUserPhotos(req.user.id);
  }

  //{GET} all photos For All
  @Get('allPhoto')
  async allApprovedPhotoForAll(): Promise<PhotoDto[]> {
    return this.photoService.allApprovedPhoto();
  }
  //{GET} all photos
  @Get('secure/allPhoto')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async allApprovedPhoto(): Promise<PhotoDto[]> {
    return this.photoService.allApprovedPhoto();
  }
  //{GET} pending
  @Get('pending')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getPendingPhotos(): Promise<PhotoDto[]> {
    return this.photoService.findPendingPhotos();
  }
  //{Post} approve with id
  @Post('approve/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async approvePhoto(@Param('id') photoId: string): Promise<PhotoDto> {
    return this.photoService.approvePhoto(photoId);
  }
  //{Post} reject with id
  @Post('reject/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async rejectPhoto(@Param('id') photoId: string): Promise<PhotoDto> {
    return this.photoService.rejectPhoto(photoId);
  }

  //{GET} view Photo secure
  @Get('secure/view/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async viewPhoto(
    @Param('id') photoId: string,
    @Request() req: any,
    @Response() res: any
  ): Promise<void> {
    const photo = await this.photoService.displayPhoto(photoId, req.user);

    const fileExtension = path.extname(photo.filename).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
    };
    const mimetype = mimeTypes[fileExtension];
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // کش به مدت 1 روز
    // ارسال فایل عکس
    const filePath = path.join(process.cwd(), 'uploads', photo.filename);
    res.sendFile(filePath);
  }
  //{GET} view Photo For All
  @Get('view/:id')
  async viewPhotoForAll(
    @Param('id') photoId: string,
    @Request() req: any,
    @Response() res: any
  ): Promise<void> {
    const photo = await this.photoService.displayPhotoForAll(photoId, req.user);

    const fileExtension = path.extname(photo.filename).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
    };
    const mimetype = mimeTypes[fileExtension];
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // کش به مدت 1 روز
    // ارسال فایل عکس
    const filePath = path.join(process.cwd(), 'uploads', photo.filename);
    res.sendFile(filePath);
  }

  //{GET} view Photo By Id
  @Get('secure/info/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async viewPhotoInfo(
    @Param('id') photoId: string,
    @Request() req: any,
  ): Promise<PhotoDto> {
    const photo = await this.photoService.displayPhoto(photoId, req.user);
    return photo;
    
  }
  //{GET} view Photo By Id For All
  @Get('info/:id')
  async viewPhotoInfoForAll(
    @Param('id') photoId: string,
    @Request() req: any,
  ): Promise<PhotoDto> {
    const photo = await this.photoService.displayPhotoForAll(photoId, req.user);
    return photo;
    
  }
}
