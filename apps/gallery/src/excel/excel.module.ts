import { Module } from '@nestjs/common';
import { EcxelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionDocument, TransactionSchema } from './excel.schema';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([
      { name: TransactionDocument.name, schema: TransactionSchema },
    ]),
  ],
  providers: [EcxelService],
  controllers: [ExcelController],
})
export class ExcelModule {}
