import { MyContext } from 'src/types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Post } from '../entities/Post';

@Resolver()
class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    return ctx.em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number, @Ctx() ctx: MyContext): Promise<Post | null> {
    return ctx.em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post> {
    const post = ctx.em.create(Post, { title });
    await ctx.em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const post = await ctx.em.findOne(Post, { id });
    if (!post) return null;
    if (title) {
      post.title = title;
      await ctx.em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    await ctx.em.nativeDelete(Post, { id });
    return true;
  }
}

export default PostResolver;
