import { MyContext } from 'src/types';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';

@ObjectType()
class PaginatedPost {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@InputType()
class PostInput {
  @Field()
  title!: string;
  @Field()
  text!: string;
}
@Resolver(Post)
class PostResolver {
  @FieldResolver()
  textSnippet(@Root() post: Post): string {
    return post.text.slice(0, 200);
  }

  @FieldResolver(() => User)
  async creator(@Root() post: Post): Promise<User> {
    const _post = await Post.findOne({
      where: { id: post.id },
      relations: ['creator']
    });
    return _post!.creator;
  }

  @Query(() => PaginatedPost)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string
  ): Promise<PaginatedPost> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const qb = getConnection()
      .createQueryBuilder()
      .select('post')
      .from(Post, 'post')
      .orderBy('"createdAt"', 'DESC')
      .take(realLimitPlusOne);
    if (cursor)
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });

    const posts = await qb.getMany();
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() ctx: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: ctx.req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) return null;
    if (title) {
      post.title = title;
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}

export default PostResolver;
