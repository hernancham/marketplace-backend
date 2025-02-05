import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  // ✅ Crear un nuevo producto
  async create(createProductDto: CreateProductDto,userId: string): Promise<Product> {

    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const newProduct = this.productRepository.create({
      ...createProductDto,
      seller: user,// Almacena solo una imagen
    });

    return await this.productRepository.save(newProduct);
  }

  // ✅ Obtener todos los productos
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  // ✅ Obtener un producto por ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  // ✅ Actualizar un producto
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id); // Verifica si el producto existe

    Object.assign(product, updateProductDto); // Mezcla los nuevos valores con el producto existente
    return await this.productRepository.save(product);
  }

  // ✅ Eliminar un producto (Soft Delete)
  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.softRemove(product); // Soft delete (elimina pero permite restaurar)
  }
}
