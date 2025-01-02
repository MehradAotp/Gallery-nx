import { IranHotel } from './iran-hotel-excel.schema';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ExcelJS from 'exceljs';
import { transformAndValidate } from 'class-transformer-validator';
import moment from 'moment-jalaali';
import { IranHotelValidatorDto } from './dto/validateExcel.dto';

@Injectable()
export class IranHotelExcelService {
  constructor(@InjectModel(IranHotel.name) private model: Model<IranHotel>) {}

  async processExcel(buffer: Buffer): Promise<IranHotelValidatorDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);
    const transactions = [];

    worksheet.eachRow((row, rowNumber): IranHotelValidatorDto => {
      if (rowNumber === 1) return;

      const jalaliDate = this.extractRichTextValue(row.getCell(1).value);
      const transaction = {
        paymentDate: moment(
          this.convertToEnglishNumbers(jalaliDate),
          'jYYYY/jMM/jDD HH:mm'
        )
          .locale('fa')
          .toISOString(),
        amount: getValidatedNumber(row.getCell(2).value, 'amount'),
        paymentId: getValidatedNumber(row.getCell(3).value, 'paymentId'),
        status: row.getCell(4).value?.toString(),
        description: this.extractRichTextValue(row.getCell(5).value),
      };

      transactions.push(transaction);
    });

    const validateTransactions = await transformAndValidate(
      IranHotelValidatorDto,
      transactions
    );

    if (Array.isArray(validateTransactions)) {
      const transactionUpsert = validateTransactions.map(async (doc) => {
        return this.model.updateOne(
          { paymentId: doc.paymentId },
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
  private extractRichTextValue(value: any): string {
    if (value && (value as ExcelJS.CellRichTextValue).richText) {
      return (value as ExcelJS.CellRichTextValue).richText
        .map((rt: any) => rt.text)
        .join('');
    }
    return value?.toString() || 'error';
  }
  private convertToEnglishNumbers(input: string): string {
    const persianNumbers = '۰۱۲۳۴۵۶۷۸۹';
    const englishNumbers = '0123456789';
    return input
      .split('')
      .map((char) =>
        persianNumbers.includes(char)
          ? englishNumbers[persianNumbers.indexOf(char)]
          : char
      )
      .join('');
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
