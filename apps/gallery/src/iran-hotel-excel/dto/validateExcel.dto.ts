import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class IranHotelValidatorDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  paymentDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  paymentId: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
