import { IsString, IsNumber, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class FlightTransactionValidatorDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  rowNumber: number;

  @IsString()
  @IsNotEmpty()
  saleSerial: string;

  @IsString()
  @IsNotEmpty()
  airlineName: string;

  @IsString()
  @IsNotEmpty()
  route: string;

  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @IsString()
  @IsNotEmpty()
  PNR: string;

  @IsString()
  @IsNotEmpty()
  passengerName: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  saleDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  purchasePrice: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  salePrice: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  agentProfit: number;

  @IsString()
  @IsNotEmpty()
  saleType: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  memberId: number;
}
