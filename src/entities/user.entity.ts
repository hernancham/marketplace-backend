import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';

export enum UserRole {
  Vendedor = 'vendedor',
  Comprador = 'comprador',
  Admin = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string; // Número de contacto para WhatsApp

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Comprador })
  role: UserRole;

  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  @OneToMany(() => Order, order => order.buyer)
  orders: Order[];

  @OneToMany(() => Review, review => review.reviewer)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
