import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { DBManager } from './db-manager.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly dbManager: DBManager) {}

  @Post()
  @HttpCode(200)
  create(
    @Body(new ValidationPipe())
    createInventoryItemsDto: CreateInventoryItemDto[],
  ) {
    try {
      return this.dbManager.createInventoryItems(createInventoryItemsDto);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Get()
  getAllInventoryItems() {
    return this.dbManager.getAllInventoryItems();
  }
}
