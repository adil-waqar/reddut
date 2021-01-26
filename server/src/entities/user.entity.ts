import bcrypt from 'bcrypt';
import { IsEmail, MinLength, validate } from 'class-validator';
import { Error as FieldError } from 'src/resolvers/user.resolver';
import { Field, ObjectType } from 'type-graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import EntityValidationError from './errors/EntityValidationError';
import { Post } from './post.entity';

@ObjectType()
@Entity()
export class User extends Base {
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

  /**
   * Hooks
   */
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const errors = await this._validate(this);
    if (errors.length > 0) throw new EntityValidationError(errors);
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  /**
   * Util methods
   */
  async _validate(object: Object): Promise<FieldError[]> {
    const errors = await validate(object, {
      stopAtFirstError: true,
      forbidUnknownValues: true,
      validationError: { target: false }
    });
    return errors.map((error) => {
      const constraint = Object.keys(error.constraints!)[0];
      return {
        field: error.property,
        message: error.constraints![constraint]
      };
    });
  }
}
