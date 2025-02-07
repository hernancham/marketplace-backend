import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../../../entities/order.entity';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'El estado debe ser Pendiente, Confirmado o Cancelado' })
  status?: OrderStatus;
}
