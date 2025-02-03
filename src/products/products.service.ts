import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CloudinaryConfig } from 'src/config/cloudinary.config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cloudinary: CloudinaryConfig,
    private readonly userRepository: Repository<User>,
  ) {}

   // ✅ Subir imagen a Cloudinary
   async uploadImage(file: Express.Multer.File): Promise<string> {
    const result = await this.cloudinary.instance.uploader.upload(file.path);
    return result.secure_url; // Retorna la URL de la imagen subida
  }

  // ✅ Crear un nuevo producto
  async create(createProductDto: CreateProductDto,userId: string, file?: Express.Multer.File): Promise<Product> {

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    let imageUrl = '';
    if (file) {
      imageUrl = await this.uploadImage(file);
    }

    const newProduct = this.productRepository.create({
      ...createProductDto,
      seller: user,
      imageUrl, // Almacena solo una imagen
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
