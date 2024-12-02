// NestJS imports
import { PartialType } from '@nestjs/mapped-types';

// Local imports
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  @IsPositive()
  public id: number;
}
