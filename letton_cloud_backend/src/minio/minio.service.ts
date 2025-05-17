// src/common/minio/minio.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { Readable } from 'stream';

@Injectable()
export class MinioService {
  constructor(
    private readonly s3: S3Client,
    @Inject('MINIO_BUCKET') private readonly bucket: string,
  ) {}

  async upload(buffer: Buffer, originalName: string, mimeType: string) {
    const ext = originalName.split('.').pop();
    const key = `${uuid()}.${ext}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );
    return key;
  }

  async download(key: string): Promise<Readable> {
    try {
      const resp = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return resp.Body as Readable;
    } catch {
      throw new NotFoundException(`File ${key} not found`);
    }
  }
  async getPresignedUrl(key: string, expiresSeconds = 21600): Promise<string> {
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: expiresSeconds },
    );
    if (!url) {
      throw new NotFoundException(`File ${key} not found`);
    }
    const minioShares = process.env.MINIO_SHARES;
    if (minioShares) {
      const originalUrl = new URL(url);
      const sharesUrl = new URL(minioShares);

      const newUrl = new URL(
        originalUrl.pathname + originalUrl.search,
        sharesUrl.origin,
      );
      return newUrl.toString();
    }
    return url;
  }
}
