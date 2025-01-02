import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ExcelJS from 'exceljs';
import { transformAndValidate } from 'class-transformer-validator';
import moment from 'moment-jalaali';
import { SnappValidatorDto } from './dto/validateExcel.dto';
import { SnappHotelReservation } from './snapp-excel.schema.dto';

@Injectable()
export class SnappExcelService {
  constructor(
    @InjectModel(SnappHotelReservation.name)
    private readonly excelModel: Model<SnappHotelReservation>
  ) {}

  async processExcel(buffer: Buffer): Promise<SnappValidatorDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);
    const transactions = [];

    worksheet.eachRow((row, rowNumber): SnappValidatorDto => {
      if (rowNumber === 1) return;

      const transaction = {
        reservationNumber: getValidatedNumber(
          row.getCell(1).value,
          'reservationNumber'
        ),
        hotel: row.getCell(2).value['text'],
        reservationDate: moment(
          row.getCell(3).value?.toString(),
          'jYYYY/jMM/jDD HH:mm'
        ).format('YYYY-MM-DD HH:mm'),
        checkInOutDate: row.getCell(4).value?.toString(),
        status: row.getCell(5).value?.toString(),
        finalPrice: row.getCell(6).value?.toString(),
      };

      transactions.push(transaction);
    });

    const validateTransactions = await transformAndValidate(
      SnappValidatorDto,
      transactions
    );

    if (Array.isArray(validateTransactions)) {
      const transactionUpsert = validateTransactions.map(async (doc) => {
        return this.excelModel.updateOne(
          { reservationNumber: doc.reservationNumber },
          { $set: doc },
          { upsert: true }
        );
      });

      await Promise.all(transactionUpsert);
    } else {
      throw new Error('validateTransactions is not an array');
    }

    return validateTransactions;
  }
}

function getValidatedNumber(value: any, fieldName: string): number {
  if (value === null || value === undefined || value === '') {
    throw new Error(`Field "${fieldName}" is empty or invalid`);
  }
  if (typeof value === 'number') {
    return value;
  }
  const cleanedValue = value.toString().replace(/[^\d.-]/g, '');
  const numberValue = Number(cleanedValue);

  if (isNaN(numberValue)) {
    throw new Error(`Field "${fieldName}" must be a valid number`);
  }
  return numberValue;
}
