import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.reviews)
  reviewer: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: 'int', default: 0 })
  rating: number; // Puntuación del producto

  @Column('text')
  comentario: string;

  @CreateDateColumn()
  createdAt: Date;
}
