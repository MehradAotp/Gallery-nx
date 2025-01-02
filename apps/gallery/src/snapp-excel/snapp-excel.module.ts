import { Module } from '@nestjs/common';
import { SnappExcelService } from './snapp-excel.service';
import { SnappExcelController } from './snapp-excel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SnappHotelReservation,
  SnappHotelReservationSchema,
} from './snapp-excel.schema.dto';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([
      { name: SnappHotelReservation.name, schema: SnappHotelReservationSchema },
    ]),
  ],

  providers: [SnappExcelService],
  controllers: [SnappExcelController],
})
export class SnappExcelModule {}
