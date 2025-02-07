import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../../entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from 'src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // El comprador crea un pedido
  @Post()
  @Auth(UserRole.Comprador, UserRole.Admin)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() buyer: User,
  ) {
    return await this.orderService.createOrder(createOrderDto, buyer);
  }

  // El comprador consulta sus pedidos
  @Get()
  @Auth(UserRole.Comprador, UserRole.Admin)
  async getOrders(@GetUser() buyer: User) {
    return await this.orderService.findAllForBuyer(buyer);
  }

  // Consultar un pedido en específico (solo para el comprador)
  @Get(':id')
  @Auth(UserRole.Comprador, UserRole.Admin)
  async getOrderById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() buyer: User,
  ) {
    return await this.orderService.findOrderById(id, buyer);
  }

  // Actualizar el estado del pedido (por ejemplo, el vendedor puede confirmar o rechazar)
  @Put(':id')
  @Auth(UserRole.Comprador, UserRole.Admin)
  async updateOrderStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    // En este caso, se espera que el vendedor (o admin) realice la actualización
    @GetUser() seller: User,
  ) {
    return await this.orderService.updateOrderStatus(id, updateOrderDto, seller);
  }

  // El comprador cancela o elimina su pedido (si la lógica de negocio lo permite)
  @Delete(':id')
  @Auth(UserRole.Comprador, UserRole.Admin)
  async deleteOrder(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() buyer: User,
  ) {
    await this.orderService.deleteOrder(id, buyer);
    return { message: 'Pedido eliminado exitosamente' };
  }
}
