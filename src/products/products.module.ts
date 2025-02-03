import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UsersModule } from 'src/users/users.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
  imports: [TypeOrmModule.forFeature([Product]), UsersModule, CloudinaryModule], // 🛠️ Inyectamos el repo de Product
  exports: [ProductsService], // Opcional, si necesitas compartir el servicio con otros módulos
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
