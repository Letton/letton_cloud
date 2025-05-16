import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

export interface JwtPayload {
  id: string;
}

const cookieExtractor = (req: any): string | null => {
  return req?.cookies?._token ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: JwtPayload): Promise<Pick<User, 'id'>> {
    const user = await this.userService.findUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException('No access to this resource');
    }

    return { id: user.id };
  }
}
