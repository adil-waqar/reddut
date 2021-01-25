import bcrypt from 'bcrypt';
import { IsEmail, MinLength, validate } from 'class-validator';
import { Error as FieldError } from 'src/resolvers/user';
import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import EntityValidationError from './errors/EntityValidationError';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

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
  @BeforeInsert()
  async validate() {
    const errors = await this._validate(this);
    if (errors.length > 0) throw new EntityValidationError(errors);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
