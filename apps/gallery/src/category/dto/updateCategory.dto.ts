import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
