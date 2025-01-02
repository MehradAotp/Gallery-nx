import { Module } from '@nestjs/common';
import { IranHotelExcelService } from './iran-hotel-excel.service';
import { IranHotelExcelController } from './iran-hotel-excel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IranHotel, IranHotelSchema } from './iran-hotel-excel.schema';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([
      { name: IranHotel.name, schema: IranHotelSchema },
    ]),
  ],
  providers: [IranHotelExcelService],
  controllers: [IranHotelExcelController],
})
export class IranHotelExcelModule {}
