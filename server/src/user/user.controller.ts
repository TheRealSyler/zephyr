import {
  Controller,
  Post,
  UseGuards,
  Req,
  BadRequestException,
  UnauthorizedException,
  Get
} from '@nestjs/common';
import { AuthGuard, AuthRequest } from 'src/auth/guards/auth.guard';
import { UserRole } from 'src/shared/utils.auth';
import { POST } from 'src/shared/api.POST';
import { SuccessResponse } from 'src/shared/api.response.success';
import { User } from 'src/entities/user.entity';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  @Post('/setRole')
  async setRole(
    @Req() req: AuthRequest<Partial<POST['user/setRole']['body']>>
  ): Promise<POST['user/setRole']['response']> {
    const { adminPassword, newRole, username } = req.body;

    if (typeof newRole !== 'number' && newRole <= 0 && newRole >= 2)
      throw new BadRequestException('NewRole is Invalid.');

    const canSetRole = adminPassword
      ? process.env.ADMIN_PASSWORD === adminPassword
      : req.token.role === UserRole.ADMIN;

    if (!canSetRole) throw new UnauthorizedException();

    const user = await User.findOne({ where: { username: username || req.token.username } });

    user.role = newRole;
    await user.save();

    return new SuccessResponse();
  }
}
