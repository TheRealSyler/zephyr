import {
  Controller,
  Get,
  Req,
  BadRequestException,
  Post,
  HttpCode,
  HttpStatus,
  Delete,
  InternalServerErrorException
} from '@nestjs/common';
import { GET } from 'src/shared/api.GET';
import { Movie } from 'src/entities/movie.entity';
import { POST } from 'src/shared/api.POST';
import { SuccessResponse } from 'src/shared/api.response.success';
import { MovieService } from './movie.service';
import { Request } from '../utils/utils.interfaces';
import { DELETE } from 'src/shared/api.DELETE';

// TODO Add roles to user and protect routes.
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getMovie(@Req() req: Request): Promise<GET['movie']['response']> {
    const name = req.query.name;
    const movie = await Movie.findOne({ where: { name }, select: ['name', 'description'] });

    if (movie) {
      return movie;
    }

    throw new BadRequestException(`Movie ${name} Not Found.`);
  }
  // TODO add pagination, and ability to get by criteria.
  @Get('/all')
  async getAllMovies(): Promise<GET['movie/all']['response']> {
    const movies = await Movie.find({ select: ['name', 'description'] });

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
      console.log(movie);
      if (!movie) {
        const newMovie = Movie.create({ name, description });
        await newMovie.save();
        return new SuccessResponse();
      }
      throw new BadRequestException(`Movie ${name} Already Exists.`);
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
