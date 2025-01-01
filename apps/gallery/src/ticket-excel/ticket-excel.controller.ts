import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { TicketFlightService } from './ticket-excel.service';
import { UploadExcelDto } from './dto/UploadExcel.dto';

@Controller('ticketFlight')
export class TicketFlightController {
  constructor(private readonly excelService: TicketFlightService) {}

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
