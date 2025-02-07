import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Product } from '../../entities/product.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto, reviewer: User): Promise<Review> {
    const { productId, rating, comentario } = createReviewDto;

    // Verificamos que el producto exista
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Producto con id ${productId} no encontrado`);
    }

    // Creamos la reseña
    const review = this.reviewRepository.create({
      reviewer,
      product,
      rating,
      comentario,
    });

    return await this.reviewRepository.save(review);
  }

  async getReviewsForProduct(productId: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['reviewer', 'product'],
    });
  }

  async updateReview(reviewId: string, updateReviewDto: UpdateReviewDto, reviewer: User): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['reviewer'],
    });
    if (!review) {
      throw new NotFoundException(`Reseña no encontrada`);
    }
    if (review.reviewer.id !== reviewer.id) {
      throw new BadRequestException(`No puedes modificar una reseña que no es tuya`);
    }
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async deleteReview(reviewId: string, reviewer: User): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['reviewer'],
    });
    if (!review) {
      throw new NotFoundException(`Reseña no encontrada`);
    }
    if (review.reviewer.id !== reviewer.id) {
      throw new BadRequestException(`No puedes eliminar una reseña que no es tuya`);
    }
    await this.reviewRepository.delete(reviewId);
  }
}
