import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from 'src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productService.findOne(id);
  }

  @Post()
  @Auth(UserRole.Admin, UserRole.Vendedor)
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() seller: any,
  ) {
    return await this.productService.createProduct(createProductDto, seller);
  }

  @Put(':id')
  @Auth(UserRole.Admin, UserRole.Vendedor)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() seller: any,
  ) {
    return await this.productService.updateProduct(id, updateProductDto, seller);
  }

  @Delete(':id')
  @Auth(UserRole.Admin, UserRole.Vendedor)
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() seller: any,
  ) {
    await this.productService.deleteProduct(id, seller);
    return { message: 'Producto eliminado exitosamente' };
  }
}
