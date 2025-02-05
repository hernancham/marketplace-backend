import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stock?: number;

  @IsEnum(ProductStatus)
  @IsOptional() // Opcional, porque tiene un valor por defecto en la entidad
  status?: ProductStatus;
}

