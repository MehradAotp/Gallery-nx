import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/users.schema';
import { Model } from 'mongoose';
import ExcelJS from 'exceljs';
import { TransactionDocument } from './excel.schema';
import { TransactionValidatorDto } from './dto/validateExcel.dto';
import { transformAndValidate } from 'class-transformer-validator';

@Injectable()
export class EcxelService {
  constructor(
    @InjectModel(TransactionDocument.name)
    private readonly excelModel: Model<TransactionDocument>
  ) {}

  async processExcel(buffer: Buffer): Promise<TransactionValidatorDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);
    const transactions = [];

    worksheet.eachRow((row, rowNumber): TransactionValidatorDto => {
      if (rowNumber === 1) return;

      const transaction = {
        date: row.getCell(1).value?.toString(),
        referenceNo: row.getCell(2).value?.toString(),
        details: row.getCell(3).value?.toString(),
        ticketNo: row.getCell(4).value?.toString(),
        passengerName: row.getCell(5).value?.toString(),
        invoice: getValidatedNumber(row.getCell(6).value, 'invoice'),
        markup: getValidatedNumber(row.getCell(7).value, 'markup'),
        commission: getValidatedNumber(row.getCell(8).value, 'commission'),
        debit: getValidatedNumber(row.getCell(9).value, 'debit'),
        credit: getValidatedNumber(row.getCell(10).value, 'credit'),
        runningBalance: getValidatedNumber(
          row.getCell(11).value,
          'runningBalance'
        ),
      };

      transactions.push(transaction);
    });

    const validateTransactions = await transformAndValidate(
      TransactionValidatorDto,
      transactions
    );

    if (Array.isArray(validateTransactions)) {
      const transactionUpsert = validateTransactions.map(async (doc) => {
        return this.excelModel.updateOne(
          { referenceNo: doc.referenceNo },
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
  const numberValue = Number(value.toString().replace(/,/g, ''));
  if (isNaN(numberValue)) {
    throw new Error(`Field "${fieldName}" must be a valid number`);
  }
  return numberValue;
}
