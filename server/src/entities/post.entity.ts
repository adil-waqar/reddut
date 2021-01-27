import { MinLength } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from './base.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @Column()
  @MinLength(1)
  title!: string;

  @Field()
  @Column()
  @MinLength(1)
  text!: string;

  @Field()
  @Column({ type: 'int', default: 0 })
  points!: number;

  @Field()
  @Column()
  creatorId!: number;

  @ManyToOne(() => User, (user) => user.posts)
  creator!: User;
}
