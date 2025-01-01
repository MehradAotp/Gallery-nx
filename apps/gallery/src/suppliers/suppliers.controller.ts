import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSuppliersDto } from './dto/createSuppliers.dto';
import { suppliresToDtoOutput } from './dto/outputSupplires.dto';
import { UpdateSuppliersDto } from './dto/updateSuppliers.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SuppliresDatatableDto } from './dto/datatable.dto';
import { PaginateRequestDto } from './dto/Paginate.request.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly subppliresService: SuppliersService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() ceateSuppliersDto: CreateSuppliersDto
  ): Promise<suppliresToDtoOutput> {
    return this.subppliresService.create(ceateSuppliersDto);
  }

  @Get('all')
  async findAll(): Promise<suppliresToDtoOutput[]> {
    return this.subppliresService.all();
  }

  @Get('id/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findOne(@Param('id') id: string): Promise<suppliresToDtoOutput | null> {
    return this.subppliresService.findOne(id);
  }

  @Patch('update/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateSuppliersDto: UpdateSuppliersDto
  ): Promise<void> {
    return this.subppliresService.update(id, updateSuppliersDto);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  delete(@Param('id') id: string): Promise<void> {
    return this.subppliresService.delete(id);
  }

  @Post('datatable')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async datatable(
    @Body() input: PaginateRequestDto
  ): Promise<SuppliresDatatableDto> {
    return this.subppliresService.datatable(input);
  }
}
