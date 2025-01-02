import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UploadExcelDto } from './dto/UploadExcel.dto';
import { SnappExcelService } from './snapp-excel.service';

@Controller('snapp-excel')
export class SnappExcelController {
  constructor(private readonly excelService: SnappExcelService) {}

  @Post('upload')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async uploadExcel(
    @Body() uploadExcelDto: UploadExcelDto,
    @Request() req: any
  ): Promise<void> {
    const transaction = await this.excelService.processExcel(
      uploadExcelDto.file.buffer
    );
  }
}
