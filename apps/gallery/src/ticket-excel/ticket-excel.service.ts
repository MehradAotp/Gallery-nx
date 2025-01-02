import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ExcelJS from 'exceljs';
import { transformAndValidate } from 'class-transformer-validator';
import { TicketFlightValidatorDto } from './dto/validateExcel.dto';
import moment from 'moment-jalaali';
import { TicketFlight } from './ticket-excel.schema';

@Injectable()
export class TicketFlightService {
  constructor(
    @InjectModel(TicketFlight.name)
    private readonly excelModel: Model<TicketFlight>
  ) {}

  async processExcel(buffer: Buffer): Promise<TicketFlightValidatorDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);
    const transactions = [];

    worksheet.eachRow((row, rowNumber): TicketFlightValidatorDto => {
      if (rowNumber === 1) return;
      const saleTypeValue = row.getCell(15).value;
      const sType = this.extractRichTextValue(saleTypeValue);
      const transaction = {
        rowNumber: rowNumber - 1,
        purchaseSerial: row.getCell(2).value?.toString(),
        buyer: row.getCell(3).value?.toString(),
        ticketCount: getValidatedNumber(row.getCell(4).value, 'ticketCount'),
        source: row.getCell(5).value?.toString(),
        destination: row.getCell(6).value?.toString(),
        flightNumber: row.getCell(7).value?.toString(),
        flightDate: moment(
          row.getCell(8).value?.toString(),
          'jYYYY/jMM/jDD HH:mm'
        ).format('YYYY-MM-DD HH:mm'),
        seller: row.getCell(9).value?.toString(),
        reference: row.getCell(10).value?.toString(),
        airline: row.getCell(11).value?.toString(),
        reservationTime: moment(
          row.getCell(12).value?.toString(),
          'jYYYY/jMM/jDD HH:mm'
        ).format('YYYY-MM-DD HH:mm'),
        totalPrice: getValidatedNumber(row.getCell(13).value, 'totalPrice'),
        email: row.getCell(14).value?.toString(),
        saleType: sType,
        saleProfit: getValidatedNumber(row.getCell(16).value, 'saleProfit'),
        memberCommission: getValidatedNumber(
          row.getCell(17).value,
          'memberCommission'
        ),
        buyerType: row.getCell(18).value?.toString(),
        flightType: row.getCell(19).value?.toString(),
        buyerMobile: row.getCell(20).value?.toString(),
        purchaseAmount: getValidatedNumber(
          row.getCell(21).value,
          'purchaseAmount'
        ),
        sellerWebsite: row.getCell(22).value?.toString(),
      };

      transactions.push(transaction);
    });

    const validateTransactions = await transformAndValidate(
      TicketFlightValidatorDto,
      transactions
    );

    if (Array.isArray(validateTransactions)) {
      const transactionUpsert = validateTransactions.map(async (doc) => {
        return this.excelModel.updateOne(
          { purchaseSerial: doc.purchaseSerial },
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
