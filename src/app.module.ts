import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/review/review.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      /* entities: [], */
      autoLoadEntities: true,
      synchronize: true, // ¡Solo para desarrollo! Desactívalo en producción.
    }),
    UserModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    ReviewModule,
    AuthModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
