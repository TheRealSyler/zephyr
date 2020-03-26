import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BaseEntity,
  OneToMany,
  ManyToOne
} from 'typeorm';
import { hash } from 'argon2';

import { List } from './list.entity';
import { MovieSuggestion } from './movieSuggestion.entity';
import { UserRole } from 'src/shared/utils.auth';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column('varchar', { length: 255, unique: true }) username: string;

  @Column('varchar', { length: 255, default: null }) email: string;

  @Column('text') password: string;

  @Column('int', { default: 0 }) tokenVersion: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DEFAULT
  })
  role: UserRole;

  @OneToMany(
    type => List,
    list => list.createdBy
  )
  lists: List[];

  @ManyToOne(
    type => MovieSuggestion,
    suggestion => suggestion.suggestedBy
  )
  suggestions: MovieSuggestion[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}
