import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, buyer: User): Promise<Order> {
    const { items } = createOrderDto;
    let total = 0;
    const orderItems: OrderItem[] = [];

    // Se ejecuta una transacción para garantizar la consistencia
    const savedOrder = await this.dataSource.transaction(async transactionalEntityManager => {
      for (const itemDto of items) {
        const product = await transactionalEntityManager.findOne(Product, { where: { id: itemDto.productId } });
        if (!product) {
          throw new NotFoundException(`Producto con id ${itemDto.productId} no encontrado`);
        }
        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(`Stock insuficiente para el producto ${product.titulo}`);
        }
        const itemPrice = Number(product.precio);
        total += itemPrice * itemDto.quantity;

        // Actualizamos el stock del producto
        product.stock -= itemDto.quantity;
        await transactionalEntityManager.save(product);

        // Creamos el item del pedido
        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.cantidad = itemDto.quantity;
        orderItem.precio = itemPrice;
        orderItems.push(orderItem);
      }

      // Creamos la orden con estado por defecto "Pendiente"
      const order = new Order();
      order.buyer = buyer;
      order.total = total;
      order.status = OrderStatus.Pendiente;
      order.items = orderItems;
      return await transactionalEntityManager.save(order);
    });

    // Retornamos la orden creada con sus relaciones
    const createdOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product'],
    });
    if (!createdOrder) {
      throw new NotFoundException('No se pudo crear el pedido');
    }
    return createdOrder;
  }

  async findAllForBuyer(buyer: User): Promise<Order[]> {
    return this.orderRepository.find({
      where: { buyer },
      relations: ['items', 'items.product'],
    });
  }

  async findOrderById(id: string, buyer: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, buyer },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Pedido no encontrado`);
    }
    return order;
  }

  async updateOrderStatus(id: string, updateOrderDto: UpdateOrderDto, seller: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'buyer'],
    });
    if (!order) {
      throw new NotFoundException(`Pedido no encontrado`);
    }

    // Se verifica que el vendedor sea dueño de al menos uno de los productos incluidos en el pedido
    const sellerOwnsProduct = order.items.some(item => item.product.seller.id === seller.id);
    if (!sellerOwnsProduct) {
      throw new BadRequestException(`No tienes permiso para actualizar este pedido`);
    }

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }
    return await this.orderRepository.save(order);
  }

  async deleteOrder(id: string, buyer: User): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id, buyer } });
    if (!order) {
      throw new NotFoundException(`Pedido no encontrado`);
    }
    await this.orderRepository.delete(id);
  }
}
