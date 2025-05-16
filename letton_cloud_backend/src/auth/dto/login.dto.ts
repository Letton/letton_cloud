import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @Matches(/^[^\0]*$/, {
    message: 'Имя пользователя содержит недопустимые символы',
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @Matches(/^[^\0]*$/, { message: 'Пароль содержит недопустимые символы' })
  password: string;
}
