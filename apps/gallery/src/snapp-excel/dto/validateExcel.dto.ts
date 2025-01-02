import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class SnappValidatorDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  reservationNumber: number;

  @IsString()
  @IsNotEmpty()
  hotel: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  reservationDate: Date;

  @IsString()
  @IsNotEmpty()
  checkInOutDate: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  finalPrice: number;
}
