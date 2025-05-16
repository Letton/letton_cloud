import {
  Controller,
  Post,
  UseInterceptors,
  Get,
  UseGuards,
  Query,
  Delete,
  UploadedFiles,
  ParseFilePipeBuilder,
  Param,
  Res,
  StreamableFile,
  BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { MinioService } from '../minio/minio.service';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { FileType } from './entities/file.entity';
import { memoryStorage } from 'multer';
import { FileOwnerGuard } from './guards/file-owner.guard';

@Controller('files')
@ApiTags('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly minioService: MinioService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить список файлов пользователя' })
  @ApiQuery({
    name: 'type',
    enum: FileType,
    required: false,
    description: 'Тип файла для фильтрации',
  })
  @ApiResponse({
    status: 200,
    description: 'Список файлов пользователя успешно получен',
  })
  async findAll(@UserId() userId: string, @Query('type') fileType: FileType) {
    return this.filesService.findAll(userId, fileType);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Скачать файл по ключу' })
  @ApiParam({ name: 'key', description: 'Ключ (имя) файла в хранилище' })
  @ApiResponse({ status: 200, description: 'Файл успешно получен' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  @UseGuards(FileOwnerGuard)
  async get(
    @Param('key') key: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile | void> {
    {
      const fileStream = await this.minioService.download(key);
      if (!fileStream) {
        res.status(404).send('File not found');
        return;
      }
      res.header('Content-Type', 'application/octet-stream');
      res.header('Content-Disposition', `attachment; filename="${key}"`);

      return new StreamableFile(fileStream);
    }
  }

  @Post(':key/share')
  @ApiOperation({ summary: 'Поделиться файлом по временной ссылке' })
  @ApiParam({ name: 'key', description: 'Ключ (имя) файла в хранилище' })
  @ApiQuery({
    name: 'expiresIn',
    description: 'Время жизни ссылки в секундах (по умолчанию 6 часов)',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Временная ссылка на файл успешно создана',
    schema: {
      properties: {
        url: {
          type: 'string',
          description: 'Временная URL для доступа к файлу',
        },
      },
    },
  })
  async share(
    @Param('key') key: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    try {
      // Преобразуем строковое значение в число и проверяем его
      const expiresInSeconds = expiresIn ? parseInt(expiresIn, 10) : 21600; // 6 часов по умолчанию

      // Ограничиваем максимальное значение expiresIn
      const validExpiresIn = Math.min(
        Math.max(isNaN(expiresInSeconds) ? 21600 : expiresInSeconds, 60), // минимум 1 минута
        604800, // максимум 7 дней
      );

      const url = await this.minioService.getPresignedUrl(key, validExpiresIn);
      return { url };
    } catch {
      throw new BadRequestException('Не удалось создать временную ссылку');
    }
  }
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузить файлы' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Файлы успешно загружены' })
  @ApiResponse({
    status: 400,
    description: 'Неверный формат запроса или превышен размер файла',
  })
  create(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({ fileIsRequired: true }),
    )
    files: Express.Multer.File[],
    @UserId() userId: string,
  ) {
    const fixedFiles = files.map((file) => {
      const fixedName = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );
      return {
        ...file,
        originalname: fixedName,
      };
    });
    return this.filesService.createMany(fixedFiles, userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Удалить файлы' })
  @ApiQuery({
    name: 'ids',
    description: 'Идентификаторы файлов для удаления (разделенные запятой)',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Файлы успешно удалены' })
  remove(@UserId() userId: string, @Query('ids') ids: string) {
    return this.filesService.remove(userId, ids);
  }
}
