import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSuppliersDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  datalidAccount?: string;
}
