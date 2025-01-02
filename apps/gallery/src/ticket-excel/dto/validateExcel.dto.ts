import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class TicketFlightValidatorDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  rowNumber: number;

  @IsString()
  @IsNotEmpty()
  purchaseSerial: string;

  @IsString()
  @IsNotEmpty()
  buyer: string;

  @IsNumber()
  @IsNotEmpty()
  ticketCount: number;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  flightDate: Date;

  @IsString()
  @IsNotEmpty()
  seller: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  airline: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  reservationTime: Date;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  totalPrice: number;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  saleType: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  saleProfit: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  memberCommission: number;

  @IsString()
  @IsNotEmpty()
  buyerType: string;

  @IsString()
  @IsNotEmpty()
  flightType: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  buyerMobile: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  purchaseAmount: number;

  @IsString()
  @IsNotEmpty()
  sellerWebsite: string;
}
