import { ClassType, Field, ObjectType } from 'type-graphql';
import Error from './error.response';

export function EntityResponse<T>(
  entityClass: ClassType<T>,
  entityName: string,
  isArray: boolean = false
) {
  @ObjectType({ isAbstract: true })
  abstract class EntityResponseClass {
    @Field(
      () => {
        if (isArray) return [entityClass];
        else return entityClass;
      },
      { nullable: true, name: entityName }
    )
    entity?: T | T[];
    @Field(() => [Error], { nullable: true })
    errors?: Error[];
  }

  return EntityResponseClass;
}
