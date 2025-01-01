import { IsNumber, IsOptional } from 'class-validator';

export class PaginateRequestDto {
  @IsOptional()
  @IsNumber()
  limit?: number | null;

  @IsOptional()
  @IsNumber()
  skip?: number | null;
}
