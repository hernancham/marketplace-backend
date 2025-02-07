import { Controller, Post, Get, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '../../entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../../entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Crear una reseña (accesible para Comprador y Admin)
  @Post()
  @Auth(UserRole.Comprador, UserRole.Admin)
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() reviewer: User,
  ) {
    return await this.reviewService.createReview(createReviewDto, reviewer);
  }

  // Obtener reseñas para un producto específico
  @Get('product/:productId')
  async getReviewsForProduct(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return await this.reviewService.getReviewsForProduct(productId);
  }

  // Actualizar una reseña (solo el autor)
  @Put(':id')
  @Auth(UserRole.Comprador, UserRole.Admin)
  async updateReview(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() reviewer: User,
  ) {
    return await this.reviewService.updateReview(id, updateReviewDto, reviewer);
  }

  // Eliminar una reseña (solo el autor)
  @Delete(':id')
  @Auth(UserRole.Comprador, UserRole.Admin)
  async deleteReview(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() reviewer: User,
  ) {
    await this.reviewService.deleteReview(id, reviewer);
    return { message: 'Reseña eliminada exitosamente' };
  }
}
