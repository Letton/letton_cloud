// src/common/minio/minio.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { MinioService } from './minio.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3Client,
      useFactory: (cfg: ConfigService) => {
        const accessKey = cfg.get<string>('MINIO_ACCESS_KEY');
        const secretKey = cfg.get<string>('MINIO_SECRET_KEY');
        const endpoint = cfg.get<string>('MINIO_ENDPOINT');
        const port = cfg.get<number>('MINIO_PORT', 9000);

        if (!accessKey || !secretKey || !endpoint) {
          throw new Error(
            'Отсутствуют обязательные параметры конфигурации MinIO',
          );
        }

        return new S3Client({
          endpoint: `http://${endpoint}:${port}`,
          forcePathStyle: true,
          region: cfg.get<string>('MINIO_REGION', 'us-east-1'),
          credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
          },
          tls: cfg.get<boolean>('MINIO_SSL', false),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'MINIO_BUCKET',
      useFactory: (cfg: ConfigService) => cfg.get<string>('MINIO_BUCKET'),
      inject: [ConfigService],
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioModule {}
