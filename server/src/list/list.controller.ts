import {
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Delete
} from '@nestjs/common';
import { POST } from 'src/shared/api.POST';
import { DELETE } from 'src/shared/api.DELETE';
import { AuthGuard, AuthRequest, Role } from 'src/auth/guards/auth.guard';
import { User } from 'src/entities/user.entity';
import { ListService } from './list.service';
import { List } from 'src/entities/list.entity';
import { SuccessResponse } from 'src/shared/api.response.success';
import { UserRole } from 'src/shared/utils.auth';

@UseGuards(AuthGuard)
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post('/create')
  async createList(
    @Req() req: AuthRequest<Partial<POST['list/create']['body']>>
  ): Promise<POST['list/create']['response']> {
    const { description, items, name } = req.body;

    const user = await User.findOne({ where: { username: req.token.username }, select: ['id'] });

    if (name && user && items) {
      const list = await List.findOne({ where: { createdBy: user, name }, select: ['id'] });

      if (!list) {
        const newList = List.create({
          description,
          name: name,
          createdBy: user
        });

        await newList.save();

        await this.listService.insertItems(items, newList);

        return new SuccessResponse();
      }
      throw new BadRequestException(`List ${name} Already Exists.`);
    }
    throw new BadRequestException();
  }

  @Role(UserRole.CONTRIBUTOR)
  @Post('/edit')
  async edit(
    @Req() req: AuthRequest<POST['list/edit']['body']>
  ): Promise<POST['list/edit']['response']> {
    const { name, ...edits } = req.body;

    const username = req.token.username;
    const user = await User.findOne({ where: { username }, select: ['id'] });

    if (name) {
      const list = await List.findOne({ where: { createdBy: user, name }, select: ['id'] });
      if (list) {
        for (const key in edits) {
          if (edits.hasOwnProperty(key)) {
            const edit = edits[key];
            list[key] = edit;
          }
        }
        list.save();
        return new SuccessResponse();
      }
      throw new BadRequestException(`User ${username} doesn't have a list named ${name}.`);
    }
    throw new BadRequestException();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/add')
  async addItems(@Req() req: AuthRequest<Partial<POST['list/add']['body']>>) {
    const { items, name } = req.body;

    if (items && name) {
      const list = await List.findOne({
        where: { name: name },
        select: ['id'],
        relations: ['createdBy', 'movies']
      });

      if (list?.createdBy?.username === req.token.username) {
        await this.listService.insertItems(items, list);
        return new SuccessResponse();
      }
    }
    throw new BadRequestException();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/remove')
  async removeItems(@Req() req: AuthRequest<Partial<POST['list/remove']['body']>>) {
    const { items, name } = req.body;

    if (items && name) {
      const list = await List.findOne({
        where: { name: name },
        select: ['id'],
        relations: ['createdBy', 'movies']
      });

      if (list?.createdBy?.username === req.token.username) {
        await this.listService.removeItems(items, list);
        return new SuccessResponse();
      }
    }
    throw new BadRequestException();
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteList(@Req() req: AuthRequest<Partial<DELETE['list']['body']>>) {
    const { name } = req.body;
    if (name) {
      const list = await List.findOne({
        where: {
          name
        },
        select: ['id'],
        relations: ['createdBy']
      });
      if (!list) {
        throw new BadRequestException(`List ${name} not found.`);
      }
      if (list?.createdBy?.username === req.token.username) {
        list.remove();
      }
      return new SuccessResponse();
    }
    throw new BadRequestException();
  }
}
