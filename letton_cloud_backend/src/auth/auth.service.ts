import {
  Injectable,
  BadRequestException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async register(dto: CreateUserDto) {
    try {
      if (!dto.username || !dto.email || !dto.password) {
        throw new BadRequestException('Все поля должны быть заполнены');
      }

      if (
        dto.username.includes('\0') ||
        dto.email.includes('\0') ||
        dto.password.includes('\0')
      ) {
        throw new BadRequestException('Недопустимые символы в данных');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email)) {
        throw new BadRequestException('Некорректный формат email');
      }

      const existingUser = await this.userService.findUserByUsername(
        dto.username,
      );
      if (existingUser) {
        throw new ConflictException(
          'Пользователь с таким именем уже существует',
        );
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const newUser = { ...dto, password: hashedPassword };
      const savedUser = await this.userService.create(newUser);
      return {
        token: this.jwtService.sign({ id: savedUser.id }),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Ошибка при регистрации пользователя');
    }
  }

  login(dto: User) {
    return {
      token: this.jwtService.sign({ id: dto.id }),
    };
  }
}
