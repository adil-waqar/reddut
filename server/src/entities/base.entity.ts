import { validate } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity as TypeOrmBaseEntity,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import FieldError from '../resolvers/responses/error.response';
import EntityValidationError from './errors/EntityValidationError';

@ObjectType({ isAbstract: true })
export default abstract class BaseEntity extends TypeOrmBaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Hooks
   */
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const errors = await this._validate(this);
    if (errors.length > 0) throw new EntityValidationError(errors);
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
