import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { List } from './list.entity';
import { MovieSuggestion } from './movieSuggestion.entity';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column('text', { nullable: true }) description: string;

  @Column('varchar', { length: 255, unique: true }) name: string;

  @ManyToMany(
    type => List,
    list => list.movies
  )
  lists: List[];

  @OneToMany(
    type => MovieSuggestion,
    rec => rec.movie
  )
  suggestions: MovieSuggestion[];

  @OneToMany(
    type => MovieSuggestion,
    rec => rec.suggestion
  )
  suggestedTo: MovieSuggestion[];
}
