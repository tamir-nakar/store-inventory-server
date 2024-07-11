import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from './prisma.service';
import {
  DB_UNIQUE_VIOLATION_EXCEPTION,
  SOME_PRODUCTS_ARE_NOT_EXIST,
} from './models/error-codes.model';
import { Product, InventoryItem } from './models/response-items.model';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Injectable()
export class DBManager {
  constructor(private prismaClient: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    try {
      await this.prismaClient.product.create({
        data: {
          name: createProductDto.name,
        },
      });

      return this.getAllProducts();
    } catch (e) {
      if (e.code === 'P2002') {
        // P2002 is the error code for unique constraint violation. re-formatting it to a custom error code
        throw new DB_UNIQUE_VIOLATION_EXCEPTION('Product name already exists');
      }
      throw e; // all other errors will be automatically dealt as 500 internal server error
    }
  }

  async getAllProducts(): Promise<Product[]> {
    // all errors will be automatically dealt as 500 internal server error
    return this.prismaClient.product.findMany({ select: { name: true } });
  }

  async enrichInventoryItemsWithProductId(
    createInventoryItemsDto: CreateInventoryItemDto[],
  ) {
    const productNames = createInventoryItemsDto.map((item) => item.name);

    const products = await this.prismaClient.product.findMany({
      where: {
        name: {
          in: productNames,
        },
      },
    });

    if (products.length !== productNames.length) {
      throw new SOME_PRODUCTS_ARE_NOT_EXIST(
        'Some of the inventory items are missing in the products list',
      );
    }

    // adding id to the inventory items
    return createInventoryItemsDto.map((item) => ({
      id: products.find((product) => product.name === item.name).id,
      ...item,
    }));
  }

  async createInventoryItems(
    createInventoryItemsDto: CreateInventoryItemDto[],
  ) {
    // if the product is not found, it will throw an error
    const inventoryItemsWithIds = await this.enrichInventoryItemsWithProductId(
      createInventoryItemsDto,
    );

    for (const item of inventoryItemsWithIds) {
      await this.prismaClient.inventoryItem.upsert({
        where: { productId: item.id },
        update: { quantity: item.quantity },
        create: {
          quantity: item.quantity,
          productId: item.id,
        },
      });
    }

    // At first I tried to use createMany to save all the items at once, but sometimes i had to upsert, so I changed it to upsert

    // await this.prismaClient.inventoryItem.createMany({
    //   data: inventoryItemsWithIds.map((item) => ({
    //     quantity: item.quantity,
    //     productId: item.id,
    //   })),
    // });

    return this.getAllInventoryItems();
  }

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    // all errors will be automatically dealt as 500 internal server error
    return this.prismaClient.inventoryItem
      .findMany({
        select: { product: { select: { name: true } }, quantity: true },
      })
      .then((items) =>
        items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
        })),
      );
  }


}
