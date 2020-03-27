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
import { MovieSuggestion } from 'src/entities/movieSuggestion.entity';
import { GET } from 'src/shared/api.GET';
import { List } from 'src/entities/list.entity';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard)
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

  @Get('/list')
  async getUsersLists(@Req() req: AuthRequest): Promise<GET['user/list']['response']> {
    const username = req.query.username || req?.token?.username;

    if (!username) throw new BadRequestException();

    const user = await User.findOne({ where: { username } });

    if (user) {
      return await List.find({
        where: { createdBy: user },
        relations: ['movies'],
        select: ['description', 'name']
      });
    }

    throw new BadRequestException(`User ${username} Not Found.`);
  }

  @Get('/suggestions')
  async getSuggestions(@Req() req: AuthRequest): Promise<GET['user/suggestions']['response']> {
    const username = req.query.username || req?.token?.username;

    if (!username) throw new BadRequestException();

    const user = await User.findOne({ where: { username } });

    if (user) {
      const suggestions = await MovieSuggestion.find({
        where: { suggestedBy: user },
        relations: ['movie', 'suggestion']
      });
      if (suggestions) {
        return suggestions;
      }
    }
    throw new BadRequestException(`User ${username} Not Found.`);
  }
}
