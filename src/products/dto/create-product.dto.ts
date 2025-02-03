import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsArray, Min } from 'class-validator';
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
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsEnum(ProductStatus)
  @IsOptional() // Opcional, porque tiene un valor por defecto en la entidad
  status?: ProductStatus;
}

