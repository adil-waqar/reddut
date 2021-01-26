import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@ObjectType({ isAbstract: true })
export class Base extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
