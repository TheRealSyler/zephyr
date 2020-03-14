import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/auth.local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule],
  providers: [LocalStrategy, AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
