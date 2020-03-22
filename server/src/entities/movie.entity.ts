import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { List } from './list.entity';

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
}
