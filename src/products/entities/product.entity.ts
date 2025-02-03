import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ProductStatus {
  Disponible = 'disponible',
  Agotado = 'agotado',
  Deshabilitado = 'deshabilitado',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn("uuid") // Cambiamos a UUID
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' }) // Permite descripciones largas
  description: string;

  @Column()
  category: string; // Podrías hacer una tabla de categorías y referenciarla

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Precio con decimales
  price: number;

  @Column({ type: 'decimal', default: 1 }) // Stock disponible
  stock: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.Disponible})
  status: ProductStatus;

  // Relación: Un producto pertenece a un usuario (vendedor)
  @ManyToOne(() => User, (user) => user.products, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerId' }) // Clave foránea
  seller: User;

  @Column({ nullable: true })
  imageUrl: string; // URL de la imagen del producto

  // Control de fechas
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
