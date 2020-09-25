import { Entity, ManyToOne, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column('text') content: string;

  @Column('text', { nullable: true }) description: string;

  @Column('varchar', { length: 255 }) name: string;

  @Column('varchar', { length: 255 }) title: string;

  @Column('date') created: Date;
  @Column('date') changed: Date;

  @ManyToOne(
    type => User,
    user => user.articles
  )
  createdBy: User;
}
