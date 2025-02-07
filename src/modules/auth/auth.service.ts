import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UserService } from 'src/modules/user/user.service';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña no es válida');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { token: accessToken, user: payload };
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const { name , email, password } = registerAuthDto;

    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('El usuario ya existe');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await this.userService.create({
      ...registerAuthDto,
      password: hashedPassword,
    });

    return {
      name,
      email,
    };
  }

  async profile(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    // returnar el usuario sin la contraseña
    const { password, ...result } = user;

    return result;
  }
}
