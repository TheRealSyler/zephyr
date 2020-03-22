import {
  Entity,
  ManyToOne,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Movie } from './movie.entity';

@Entity()
export class List extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column('text', { nullable: true }) description: string;

  @Column('varchar', { length: 255 }) name: string;

  @ManyToOne(
    type => User,
    user => user.lists
  )
  createdBy: User;

  @ManyToMany(
    type => Movie,
    movie => movie.lists
  )
  @JoinTable()
  movies: Movie[];
}
