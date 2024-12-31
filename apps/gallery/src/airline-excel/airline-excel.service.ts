import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ExcelJS from 'exceljs';
import { transformAndValidate } from 'class-transformer-validator';
import { FlightTransaction } from './airline-excel.schema';
import { FlightTransactionValidatorDto } from './dto/validateExcel.dto';
import moment from 'moment-jalaali';
@Injectable()
export class AirlineExcelService {
  constructor(
    @InjectModel(FlightTransaction.name)
    private readonly excelModel: Model<FlightTransaction>
  ) {}

  async processExcel(buffer: Buffer): Promise<FlightTransactionValidatorDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);
    const transactions = [];

    worksheet.eachRow((row, rowNumber): FlightTransactionValidatorDto => {
      if (rowNumber === 1) return;

      const transaction = {
        rowNumber: rowNumber - 1,
        saleSerial: row.getCell(2).value?.toString(),
        airlineName: row.getCell(3).value?.toString(),
        route: row.getCell(4).value?.toString(),
        flightNumber: row.getCell(5).value?.toString(),
        PNR: row.getCell(6).value?.toString(),
        passengerName: row.getCell(7).value?.toString(),
        saleDate: moment(
          row.getCell(8).value?.toString(),
          'jYYYY/jMM/jDD HH:mm'
        ).format('YYYY-MM-DD HH:mm'),
        purchasePrice: getValidatedNumber(
          row.getCell(9).value,
          'purchasePrice'
        ),
        salePrice: getValidatedNumber(row.getCell(10).value, 'salePrice'),
        agentProfit: getValidatedNumber(row.getCell(11).value, 'agentProfit'),
        saleType: row.getCell(12).value?.toString(),
        status: row.getCell(13).value?.toString(),
        memberId: getValidatedNumber(row.getCell(14).value, 'memberId'),
      };

      transactions.push(transaction);
    });

    const validateTransactions = await transformAndValidate(
      FlightTransactionValidatorDto,
      transactions
    );

    if (Array.isArray(validateTransactions)) {
      const transactionUpsert = validateTransactions.map(async (doc) => {
        return this.excelModel.updateOne(
          { saleSerial: doc.saleSerial },
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
