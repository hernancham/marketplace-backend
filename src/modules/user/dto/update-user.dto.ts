// src/modules/user/dto/update-user.dto.ts
import { IsOptional, IsString, IsEmail, IsEnum, ValidateIf, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  // Si el usuario actualiza su rol a vendedor, se requiere el teléfono.
  @ValidateIf(o => o.role === UserRole.Vendedor)
  @IsNotEmpty({ message: 'El número de teléfono es requerido para cambiar el rol a vendedor' })
  @IsString()
  phone?: string;
}
