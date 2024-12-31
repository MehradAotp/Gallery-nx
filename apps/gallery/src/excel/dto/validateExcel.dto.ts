import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionValidatorDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  referenceNo: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  ticketNo?: string;

  @IsOptional()
  @IsString()
  passengerName?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  invoice: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  markup: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  commission: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  debit: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  credit: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  runningBalance: number;
}
