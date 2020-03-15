import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BaseEntity } from 'typeorm';
import { hash } from 'argon2';

import * as uuid from 'uuid';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('varchar', { length: 255, unique: true }) username: string;

  @Column('varchar', { length: 255, default: null }) email: string;

  @Column('text') password: string;

  @Column('int', { default: 0 }) tokenVersion: number;

  @BeforeInsert()
  addId() {
    this.id = uuid.v4();
  }
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}
