import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Post extends Base {
  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
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
