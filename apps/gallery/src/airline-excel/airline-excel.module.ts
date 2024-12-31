import { Module } from '@nestjs/common';
import { AirlineExcelController } from './airline-excel.controller';
import { AirlineExcelService } from './airline-excel.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FlightTransaction,
  FlightTransactionSchema,
} from './airline-excel.schema';

@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([
      { name: FlightTransaction.name, schema: FlightTransactionSchema },
    ]),
  ],
  controllers: [AirlineExcelController],
  providers: [AirlineExcelService],
})
export class AirlineExcelModule {}
