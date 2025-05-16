import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получение данных текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Данные пользователя успешно получены',
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  getMe(@UserId() userId: string) {
    return this.usersService.findUserById(userId);
  }
}
