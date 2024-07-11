import {
  Controller,
  Get,
  Body,
  Put,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { DBManager } from './db-manager.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductsController {
  constructor(private readonly dbManager: DBManager) {}

  @Get('all')
  async getAllProducts() {
    return this.dbManager.getAllProducts();
  }

  @Put()
  @HttpCode(200)
  createNewProduct(
    @Body(new ValidationPipe()) createProductDto: CreateProductDto,
  ) {
    return this.dbManager.createProduct(createProductDto);
  }
}
