import { Controller,Post, Body, Get, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Auth } from './decorators/auth.decorator';
import { UserRole } from 'src/users/entities/user.entity';

interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Get('profile')
  @Auth(UserRole.Comprador, UserRole.Vendedor, UserRole.Admin)
  profile(@Request() req: RequestWithUser) {
    return this.authService.profile(req.user.email);
  }
}
