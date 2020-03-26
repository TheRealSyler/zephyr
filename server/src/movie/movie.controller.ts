import {
  Controller,
  Get,
  Req,
  BadRequestException,
  Post,
  HttpCode,
  HttpStatus,
  Delete,
  InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { GET } from 'src/shared/api.GET';
import { Movie } from 'src/entities/movie.entity';
import { POST } from 'src/shared/api.POST';
import { SuccessResponse } from 'src/shared/api.response.success';
import { MovieService } from './movie.service';
import { Request } from '../utils/utils.interfaces';
import { DELETE } from 'src/shared/api.DELETE';
import { AuthGuard, AuthRequest } from 'src/auth/guards/auth.guard';
import { MovieSuggestion } from 'src/entities/movieSuggestion.entity';
import { User } from 'src/entities/user.entity';

// TODO Add roles to user and protect routes.
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getMovie(@Req() req: Request): Promise<GET['movie']['response']> {
    const name = req.query.name;

    const movie = await Movie.findOne({
      where: { name },
      select: ['id', 'name', 'description'],
      relations: ['suggestions']
    });

    if (movie) {
      return movie;
    }

    throw new BadRequestException(`Movie ${name} Not Found.`);
  }
  // TODO add pagination, and ability to get by criteria.
  @Get('/all')
  async getAllMovies(): Promise<GET['movie/all']['response']> {
    const movies = await Movie.find({
      select: ['id', 'name', 'description']
    });

    if (movies) {
      return movies;
    }

    throw new InternalServerErrorException();
  }

  @Post('/create')
  async createMovie(
    @Req() req: Request<POST['movie/create']['body']>
  ): Promise<POST['movie/create']['response']> {
    const { description, name } = req.body;

    if (name) {
      const movie = await Movie.findOne({ where: { name }, select: ['id'] });
      if (!movie) {
        const newMovie = Movie.create({ name, description });
        await newMovie.save();
        return new SuccessResponse();
      }
      throw new BadRequestException(`Movie ${name} Already Exists.`);
    }
    throw new BadRequestException();
  }

  @UseGuards(AuthGuard)
  @Post('/suggest')
  async suggestMovie(
    @Req() req: AuthRequest<POST['movie/suggest']['body']>
  ): Promise<POST['movie/suggest']['response']> {
    const { addToSuggested, movie: movieName, suggestion: suggestionName } = req.body;

    const [user, movie, suggestedMovie] = await Promise.all([
      User.findOne({ where: { username: req.token.username } }),
      Movie.findOne({ where: { name: movieName }, select: ['id'] }),
      Movie.findOne({ where: { name: suggestionName }, select: ['id'] })
    ]);

    const suggestion = await MovieSuggestion.findOne({
      where: { movie, suggestion: suggestedMovie },
      relations: ['suggestedBy'],
      loadRelationIds: true
    });

    if (user && movie && suggestedMovie && movie.id !== suggestedMovie.id) {
      if (suggestion) {
        const isSuggested = (suggestion.suggestedBy as any).find(d => d === user.id) !== undefined;
        console.log(suggestion.suggestedBy);
        if (addToSuggested && !isSuggested) {
          await MovieSuggestion.createQueryBuilder()
            .relation('suggestedBy')
            .of(suggestion)
            .add(user);
          await MovieSuggestion.createQueryBuilder()
            .update()
            .set({ numberOfSuggestions: () => 'numberOfSuggestions + 1' })
            .where('id = :id', { id: suggestion.id })
            .execute();

          return new SuccessResponse('Added To Suggested.');
        } else if (!addToSuggested && isSuggested) {
          await MovieSuggestion.createQueryBuilder()
            .relation('suggestedBy')
            .of(suggestion)
            .remove(user);

          await MovieSuggestion.createQueryBuilder()
            .update()
            .set({ numberOfSuggestions: () => 'numberOfSuggestions - 1' })
            .where('id = :id', { id: suggestion.id })
            .execute();

          if (suggestion.suggestedBy.length <= 1) {
            await suggestion.remove();
            return new SuccessResponse('Removed Suggestion.');
          }

          return new SuccessResponse('Removed From Suggested.');
        } else {
          return new SuccessResponse('Already Set.');
        }
      } else if (addToSuggested) {
        const newSuggestion = MovieSuggestion.create({
          suggestedBy: [user],
          suggestion: suggestedMovie,
          numberOfSuggestions: 1,
          movie
        });

        await newSuggestion.save();

        return new SuccessResponse('Created New Suggestion');
      }
    }
    throw new BadRequestException();
  }

  @Post('/edit')
  async editMovie(
    @Req() req: Request<POST['movie/edit']['body']>
  ): Promise<POST['movie/create']['response']> {
    const { name, ...edits } = req.body;

    if (name) {
      const movie = await Movie.findOne({ where: { name }, select: ['id'] });
      if (movie) {
        for (const key in edits) {
          if (edits.hasOwnProperty(key)) {
            const edit = edits[key];
            movie[key] = edit;
          }
        }
        movie.save();
        return new SuccessResponse();
      }
      throw new BadRequestException(`Movie ${name} Doesn't Exists.`);
    }
    throw new BadRequestException();
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteMovie(@Req() req: Request<DELETE['movie']['body']>) {
    const { name } = req.body;
    if (name) {
      const movie = await Movie.findOne({
        where: {
          name
        },
        select: ['id']
      });
      if (!movie) {
        throw new BadRequestException(`Movie ${name} not found.`);
      }
      movie.remove();

      return new SuccessResponse();
    }
    throw new BadRequestException();
  }
}
