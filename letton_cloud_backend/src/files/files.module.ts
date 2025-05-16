import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { MinioModule } from 'src/minio/minio.module';
import { FileOwnerGuard } from './guards/file-owner.guard';

@Module({
  controllers: [FilesController],
  providers: [FilesService, FileOwnerGuard],
  imports: [TypeOrmModule.forFeature([File]), MinioModule],
})
export class FilesModule {}
