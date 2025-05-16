import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { FilesService } from '../files.service';

@Injectable()
export class FileOwnerGuard implements CanActivate {
  constructor(private readonly filesService: FilesService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    const key = req.params.key || req.query.ids;

    const isOwner = await this.filesService.isOwner(user.userId, key);
    if (!isOwner) {
      throw new ForbiddenException('You do not own this file');
    }
    return true;
  }
}
