import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  findUserByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }

  findUserById(id: string) {
    return this.repository.findOne({
      where: { id },
      select: ['id', 'username', 'email'],
    });
  }

  create(dto: CreateUserDto) {
    return this.repository.save(dto);
  }
}
