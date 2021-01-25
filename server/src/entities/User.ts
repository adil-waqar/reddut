import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  PrimaryKey,
  Property
} from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import { IsEmail, MinLength, validate } from 'class-validator';
import { Error as FieldError } from 'src/resolvers/user';
import { Field, ObjectType } from 'type-graphql';
import EntityValidationError from './errors/EntityValidationError';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  @MinLength(3)
  username!: string;

  @Field()
  @Property({ type: 'text', unique: true })
  @IsEmail()
  email!: string;

  @Property({ type: 'text' })
  @MinLength(3)
  password!: string;

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

  @BeforeUpdate()
  @BeforeCreate()
  async validate() {
    const errors = await this._validate(this);
    if (errors.length > 0) throw new EntityValidationError(errors);
    this.password = await bcrypt.hash(this.password, 10);
  }
}
