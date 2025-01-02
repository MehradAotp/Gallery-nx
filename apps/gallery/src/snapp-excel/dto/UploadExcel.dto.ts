import { ApiProperty } from '@nestjs/swagger';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

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
