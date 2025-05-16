import { User } from 'src/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'files' })
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @ManyToOne(() => User, (user) => user.files)
  user: User;

  @DeleteDateColumn()
  deletedAt?: Date;
}

export enum FileType {
  ALL = 'all',
  PHOTOS = 'photos',
  TRASH = 'trash',
}
