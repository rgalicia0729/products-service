// NestJS imports
import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

// Third-party imports
import { Product } from '@prisma/client';

// Local imports
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from '../common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'CREATE_PRODUCT' })
  create(@Payload() payload: CreateProductDto): Promise<Product> {
    return this.productsService.create(payload);
  }

  @MessagePattern({ cmd: 'FIND_PRODUCTS' })
  findAll(@Payload() payload: PaginationDto): Promise<any> {
    return this.productsService.findAll(payload);
  }

  @MessagePattern({ cmd: 'FIND_PRODUCT' })
  findOne(@Payload('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: 'UPDATE_PRODUCT' })
  update(@Payload() payload: UpdateProductDto): Promise<Product> {
    return this.productsService.update(payload);
  }

  @MessagePattern({ cmd: 'DELETE_PRODUCT' })
  remove(@Payload('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: 'VALIDATE_PRODUCTS' })
  validateProducts(@Payload() ids: number[]): Promise<Product[]> {
    return this.productsService.validateProducts(ids);
  }
}
