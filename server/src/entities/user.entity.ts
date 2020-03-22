import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BaseEntity,
  OneToMany,
  JoinTable
} from 'typeorm';
import { hash } from 'argon2';

import { List } from './list.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column('varchar', { length: 255, unique: true }) username: string;

  @Column('varchar', { length: 255, default: null }) email: string;

  @Column('text') password: string;

  @Column('int', { default: 0 }) tokenVersion: number;

  @OneToMany(
    type => List,
    list => list.createdBy,
    { cascade: true }
  )
  @JoinTable()
  lists: List[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}
