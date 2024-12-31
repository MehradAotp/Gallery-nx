import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInstance, IsOptional, Validate } from 'class-validator';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { TransactionValidatorDto } from './validateExcel.dto';

export class UploadExcelDto {
  @IsFile()
  @MaxFileSize(1e6)
  @ApiProperty({
    description: 'file',
    type: 'string',
    format: 'binary',
  })
  file: MemoryStoredFile;
}
