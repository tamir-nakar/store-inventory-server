import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  @IsNotEmpty({ message: 'invalid inventoryItem, name is missing' })
  name: string;

  @IsNotEmpty({ message: 'invalid inventoryItem, quantity is missing' })
  @IsNumber()
  quantity: number;
}
