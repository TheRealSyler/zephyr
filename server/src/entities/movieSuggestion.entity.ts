import { Entity, BaseEntity, ManyToOne, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from './user.entity';
import { MovieSuggestion as IMovieSuggestion } from '../shared/api.interfaces';
@Entity()
export class MovieSuggestion extends BaseEntity implements IMovieSuggestion {
  @PrimaryGeneratedColumn() id: number;

  @Column({ default: 0 })
  numberOfSuggestions: number;

  /**The Movie the recommendation is for. */
  @ManyToOne(
    type => Movie,
    movie => movie.suggestions
  )
  movie: Movie;

  /**The Movie that is being recommended. */
  @ManyToOne(
    type => Movie,
    movie => movie.suggestedTo,
    { eager: true }
  )
  suggestion: Movie;

  @OneToMany(
    type => User,
    user => user.suggestions,
    { cascade: true }
  )
  suggestedBy: User[];
}
