import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({
    type: LoginDto,
    description: 'Данные для входа пользователя',
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Request() req: Request & { user: User },
  ) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Данные для регистрации нового пользователя',
  })
  @ApiResponse({
    status: 400,
    description: 'Пользователь с таким email уже существует',
  })
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}
