import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UploadExcelDto } from './dto/UploadExcel.dto';
import { IranHotelExcelService } from './iran-hotel-excel.service';

@Controller('iran-hotel-excel')
export class IranHotelExcelController {
  constructor(private readonly excelService: IranHotelExcelService) {}

  @Post('upload')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async uploadExcel(@Body() uploadExcelDto: UploadExcelDto): Promise<void> {
    await this.excelService.processExcel(uploadExcelDto.file.buffer);
  }
}
