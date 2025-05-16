import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File, FileType } from './entities/file.entity';
import { Repository } from 'typeorm';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class FilesService {
  protected _bucketName = 'storage';

  constructor(
    @InjectRepository(File) private repository: Repository<File>,
    private readonly minioService: MinioService,
  ) {}

  findAll(userId: string, fileType: FileType) {
    const qb = this.repository.createQueryBuilder('file');
    qb.where('file.user = :userId', { userId });

    if (fileType === FileType.PHOTOS) {
      qb.andWhere('file.mimetype ILIKE :type', { type: '%image%' });
    }

    if (fileType === FileType.TRASH) {
      qb.withDeleted().andWhere('file.deletedAt IS NOT NULL');
    }

    return qb.getMany();
  }

  async createMany(files: Express.Multer.File[], userId: string) {
    try {
      const entities: File[] = [];

      for (const file of files) {
        const key = await this.minioService.upload(
          file.buffer,
          file.originalname,
          file.mimetype,
        );
        const entity = this.repository.create({
          filename: key,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          user: { id: userId },
        });
        entities.push(entity);
      }
      return this.repository.save(entities);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to upload files: ${errorMessage}`);
    }
  }

  async remove(userId: string, ids: string) {
    try {
      if (!ids || ids.trim() === '') {
        return { affected: 0 };
      }

      const idsArray = ids
        .split(',')
        .filter((id) => id.trim() !== '')
        .map((id) => id.trim())
        .filter((id) => {
          try {
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              id,
            );
          } catch {
            return false;
          }
        });

      if (idsArray.length === 0) {
        return { affected: 0 };
      }

      const qb = this.repository.createQueryBuilder('file');
      qb.where('id IN (:...ids) AND userId = :userId', {
        ids: idsArray,
        userId,
      });

      return qb.softDelete().execute();
    } catch (error) {
      console.error('Ошибка при удалении файлов:', error);
      return { affected: 0 };
    }
  }

  async isOwner(userId: string, key: string): Promise<boolean> {
    try {
      const exists = await this.repository.exists({
        where: {
          filename: key,
          user: { id: userId },
        },
      });
      return exists;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
