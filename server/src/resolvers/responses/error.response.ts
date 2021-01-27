import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class Error {
  @Field({ nullable: true })
  field?: string;
  @Field()
  message!: string;
}
