import bcrypt from 'bcrypt';
import { IsEmail, MinLength } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from './base.entity';
import { Post } from './post.entity';
import { Updoot } from './updoot.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Column({ unique: true })
  @MinLength(3)
  username!: string;

  @Field()
  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  @MinLength(3)
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
