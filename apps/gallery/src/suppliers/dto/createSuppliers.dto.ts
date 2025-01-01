import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSuppliersDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  datalidAccount: string;
}
