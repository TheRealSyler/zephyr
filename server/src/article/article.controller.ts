import { Controller, Get, UseGuards, Post, BadRequestException, Req, Delete } from '@nestjs/common';
import { AuthGuard, AuthRequest } from 'src/auth/guards/auth.guard';
import { GET } from 'src/shared/api.GET';
import { POST } from 'src/shared/api.POST';
import { Request } from 'src/utils/utils.interfaces';
import { User } from 'src/entities/user.entity';
import { Article } from 'src/entities/article.entity';
import { SuccessResponse } from 'src/shared/api.response.success';
import { urlFriendly } from 'src/shared/utils';
import { DELETE } from 'src/shared/api.DELETE';
import { Clamp } from 'src/shared/utils.math';
import { Article as CleanArticle } from '../shared/api.interfaces';
import { createObjectFromArray, convertToUtf8 } from 'src/utils/utils';

/**Fields that are allowed to be edited by the user. */
const allowedEdits = createObjectFromArray<(keyof Partial<Article>)[], Partial<Article>>([
  'content',
  'description',
  'title'
]);

@Controller('article')
export class ArticleController {
  @Get()
  async getArticle(
    @Req() req: Request<{}, GET['article']['query']>
  ): Promise<GET['article']['response']> {
    const { name, user, page, results, sort = 'newest' } = req.query;
    const USER = await User.findOne({ where: { username: user }, select: ['id'] });

    if (user && !USER) {
      throw new BadRequestException(`User ${user} doesn't exist.`);
    }
    if (user && name) {
      const article = await Article.findOne({
        where: { createdBy: USER, name },
        relations: ['createdBy']
      });
      if (article) {
        return getCleanArticle(article);
      }
      throw new BadRequestException(`Article ${user}/${name} doesn't exist.`);
    }

    const take = Clamp(1, 500, +results || 10);
    const skip = (+page || 0) * take;
    const createdOrder = sort === 'newest' ? 'DESC' : 'ASC';

    const articles = await Article.find({
      where: USER ? { createdBy: USER } : undefined,
      order: { created: createdOrder },
      take,
      skip,
      relations: ['createdBy']
    });
    return articles.map(a => getCleanArticle(a));
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteArticle(
    @Req() req: AuthRequest<DELETE['article']['body']>
  ): Promise<DELETE['article']['response']> {
    const { name } = req.body;

    const username = req.token.username;
    const user = await User.findOne({ where: { username } });
    if (user) {
      const article = await Article.findOne({ where: { createdBy: user, name } });
      if (article) {
        article.remove();
        return new SuccessResponse();
      }
    }
    throw new BadRequestException();
  }

  @Post('/publish')
  @UseGuards(AuthGuard)
  async createArticle(
    @Req() req: AuthRequest<POST['article/publish']['body']>
  ): Promise<POST['article/publish']['response']> {
    const { content, title, name, description } = req.body;

    if (!urlFriendly(name)) {
      throw new BadRequestException(`Name ${name} is not url friendly.`);
    }

    const username = req.token.username;
    const user = await User.findOne({ where: { username }, select: ['id'] });
    if (content && title && user) {
      const article = await Article.findOne({ where: { createdBy: user, name } });
      if (!article) {
        const newArticle = Article.create({
          content: convertToUtf8(content),
          title: convertToUtf8(title),
          name: convertToUtf8(name),
          description: convertToUtf8(description),
          changed: new Date(),
          created: new Date(),
          createdBy: user
        });

        await newArticle.save();
        return new SuccessResponse();
      }

      throw new BadRequestException('Cannot publish article that already exists.');
    }
    throw new BadRequestException('Cannot publish article without content and or title');
  }

  @Post('/edit')
  @UseGuards(AuthGuard)
  async editArticle(
    @Req() req: AuthRequest<POST['article/edit']['body']>
  ): Promise<POST['article/edit']['response']> {
    const { name, ...edits } = req.body;

    const username = req.token.username;
    const user = await User.findOne({ where: { username }, select: ['id'] });
    if (edits && user) {
      const editedFields = [];
      const article = await Article.findOne({ where: { createdBy: user, name }, select: ['id'] });
      if (article) {
        for (const key in edits) {
          if (key in allowedEdits && edits.hasOwnProperty(key)) {
            const edit = edits[key];
            editedFields.push(key);

            article[key] = convertToUtf8(edit);
          }
        }
        article.changed = new Date();
        await article.save();
        return new SuccessResponse(`Edited: ${editedFields}`);
      }

      throw new BadRequestException(`Article ${username}/${name} doesn't exist.`);
    }
    throw new BadRequestException('No Edits Provided');
  }
}
function getCleanArticle(article: Article): CleanArticle {
  return {
    title: article.title,
    content: article.content,
    description: article.description,
    name: article.name,
    changed: article.changed,
    created: article.created,
    createdBy: article.createdBy?.username
  };
}
