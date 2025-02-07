import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User, UserRole } from '../../entities/user.entity';
import { Category } from '../../entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto, seller: User): Promise<Product> {
    const { titulo, descripcion, precio, stock, imageUrl, categoryIds } = createProductDto;

    // Crear la instancia del producto
    const product = this.productRepository.create({
      titulo,
      descripcion,
      precio,
      stock,
      imageUrl,
      seller,
    });

    // Si se envían categorías, asignarlas (se asume que existen)
    if (categoryIds && categoryIds.length > 0) {
      product.categories = categoryIds.map(id => ({ id } as Category));
    }

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['seller', 'categories'] });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto, seller: User): Promise<Product> {
    const product = await this.findOne(id);

    // Verificar que el producto pertenezca al vendedor autenticado
    if (product.seller.id !== seller.id) {
      throw new BadRequestException('No puedes actualizar un producto que no te pertenece');
    }

    const { titulo, descripcion, precio, stock, imageUrl, categoryIds } = updateProductDto;

    if (titulo !== undefined) product.titulo = titulo;
    if (descripcion !== undefined) product.descripcion = descripcion;
    if (precio !== undefined) product.precio = precio;
    if (stock !== undefined) product.stock = stock;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    if (categoryIds && categoryIds.length > 0) {
      product.categories = categoryIds.map(id => ({ id } as Category));
    }

    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string, seller: User): Promise<void> {
    const product = await this.findOne(id);

    // Verificar que el producto pertenezca al vendedor autenticado
    if (product.seller.id !== seller.id) {
      throw new BadRequestException('No puedes eliminar un producto que no te pertenece');
    }

    await this.productRepository.delete(id);
  }
}
