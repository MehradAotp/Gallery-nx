import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsArray()
  @Transform(({ value }) => value.split(','))
  categories: string[];

  @IsString()
  description?: string;

  @ApiProperty({
    description: 'file',
    type: 'string',
    format: 'binary',
  })
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  file: MemoryStoredFile;
}
