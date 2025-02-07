import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  Pendiente = 'Pendiente',
  Confirmado = 'Confirmado',
  Cancelado = 'Cancelado',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.orders)
  buyer: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal')
  total: number; // Total del pedido calculado a partir de los items

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pendiente })
  status: OrderStatus; // Estado del pedido (por ejemplo: pending, confirmed, cancelled)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
