import { Controller, Get, Put, Delete, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from '../../entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint para que el usuario autenticado consulte su propio perfil
  @Get('profile')
  @Auth(UserRole.Comprador, UserRole.Vendedor, UserRole.Admin)
  async getProfile(@GetUser() user: User): Promise<User> {
    return user;
  }

  // Endpoint para actualizar el perfil del usuario autenticado
  @Put('profile')
  @Auth(UserRole.Comprador, UserRole.Vendedor, UserRole.Admin)
  async updateProfile(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    // Si se intenta actualizar el rol a Admin y el usuario actual no es Admin, se rechaza la operación
    if (updateUserDto.role === UserRole.Admin && user.role !== UserRole.Admin) {
      throw new BadRequestException('No se permite actualizar a rol Admin');
    }
    return await this.userService.update(user.id, updateUserDto);
  }

  // Endpoint opcional para que el usuario elimine su propio perfil
  @Delete('profile')
  @Auth(UserRole.Comprador, UserRole.Vendedor, UserRole.Admin)
  async deleteProfile(@GetUser() user: User): Promise<any> {
    return await this.userService.remove(user.id);
  }

  // Endpoint administrativo para listar todos los usuarios (accesible solo para Admin)
  @Get()
  @Auth(UserRole.Admin)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }
}
