import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadExcelDto } from './dto/excel.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EcxelService } from './excel.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: EcxelService) {}

  @Post('uplaod')
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
