// NestJS imports
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

// Third-party imports
import { PrismaClient, Product } from '@prisma/client';

// Local imports
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(payload: CreateProductDto): Promise<Product> {
    const product = await this.product.create({
      data: payload,
    });

    return product;
  }

  async findAll(payload: PaginationDto): Promise<any> {
    const { page, limit } = payload;

    const totalRecords = await this.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalRecords / limit);

    const products = await this.product.findMany({
      where: { available: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: products,
      totalRecords,
      page,
      lastPage,
    };
  }

  async findOne(id: number): Promise<Product> {
    return await this.findProductById(id);
  }

  async update(payload: UpdateProductDto): Promise<Product> {
    const { id, ...data } = payload;

    await this.findProductById(id);

    return await this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number): Promise<Product> {
    await this.findProductById(id);

    return await this.product.update({
      where: { id },
      data: { available: false },
    });
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id: ${id} not found`,
      });
    }

    return product;
  }

  async validateProducts(ids: number[]): Promise<Product[]> {
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Some products were not found',
      });
    }

    return products;
  }
}
