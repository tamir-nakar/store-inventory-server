import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { InventoryController } from './inventory.controller';
import { DBManager } from './db-manager.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [ProductsController, InventoryController],
  providers: [DBManager, PrismaService],
})
export class AppModule {}
