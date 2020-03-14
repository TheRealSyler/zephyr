import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { verify } from 'argon2';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await User.findOne({ where: { username } });

    if (user && verify(user.password, password)) {
      const { password, id, ...userData } = user;
      return userData;
    }

    throw new UnauthorizedException();
  }
}
