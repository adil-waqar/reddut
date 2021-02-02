import { MyContext } from 'src/interfaces/MyContext';
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
import { getConnection, getManager } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Updoot } from '../entities/updoot.entity';
import { User } from '../entities/user.entity';
import { isAuth } from '../middleware/isAuth';
import handleException from '../utils/handleException';
import { EntityResponse } from './responses/generic.response';

@InputType()
class PostInput {
  @Field()
  title!: string;
  @Field()
  text!: string;
}

@InputType()
class EditPostInput {
  @Field()
  id!: number;
  @Field({ nullable: true })
  title?: string;
  @Field({ nullable: true })
  text?: string;
}

@InputType()
class VoteInput {
  @Field()
  postId: number;
  @Field()
  value: number;
}

@ObjectType()
class PostResponse extends EntityResponse(Post, 'post') {}

@ObjectType()
class PaginatedPost extends EntityResponse(Post, 'posts', true) {
  @Field()
  hasMore?: boolean;
}

@Resolver(Post)
class PostResolver {
  @FieldResolver()
  textSnippet(@Root() post: Post): string {
    return post.text.slice(0, 200);
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('input') input: VoteInput,
    @Ctx() ctx: MyContext
  ): Promise<PostResponse> {
    try {
      const { userId } = ctx.req.session;
      const { postId, value } = input;
      const realValue = value > 0 ? 1 : -1;
      return await getManager().transaction<PostResponse>(
        async (transactionalEntityManager) => {
          const doot = await transactionalEntityManager.findOne(Updoot, {
            where: { postId, userId }
          });

          if (doot && doot.value === realValue) {
            console.log(doot.value, realValue);
            return {};
          } else if (doot && doot.value !== realValue) {
            doot.value = realValue;
            await transactionalEntityManager.save(doot);
          } else {
            await transactionalEntityManager.insert(Updoot, {
              userId,
              postId,
              value: realValue
            });
          }

          const post = await transactionalEntityManager.findOne(Post, {
            where: { id: postId }
          });
          if (!post)
            return {
              errors: [
                { message: 'the post you are trying to upvote is deleted :(' }
              ]
            };
          post.points = post.points + realValue * (doot ? 2 : 1);
          const nPost = await transactionalEntityManager.save(post);
          return { entity: nPost };
        }
      );
    } catch (e) {
      console.error(`an error occured in vote(...) resolver: ${e}`);
      return {};
    }
  }

  @FieldResolver(() => User)
  async creator(@Root() post: Post, @Ctx() ctx: MyContext): Promise<User> {
    return ctx.userLoader.load(post.creatorId);
  }

  @Query(() => PaginatedPost)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string
  ): Promise<PaginatedPost> {
    try {
      const realLimit = Math.min(50, limit);
      const realLimitPlusOne = realLimit + 1;

      const qb = getConnection()
        .createQueryBuilder()
        .select('post')
        .from(Post, 'post')
        .orderBy('"createdAt"', 'DESC')
        .take(realLimitPlusOne);
      if (cursor)
        qb.where('"createdAt" < :cursor', {
          cursor: new Date(parseInt(cursor))
        });

      const posts = await qb.getMany();
      return {
        entity: posts.slice(0, realLimit),
        hasMore: posts.length === realLimitPlusOne
      };
    } catch (e) {
      console.error(`an error occured in the posts(...) resolver: ${e}`);
      return { errors: handleException(e) };
    }
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() ctx: MyContext
  ): Promise<PostResponse> {
    try {
      const post = await Post.create({
        ...input,
        creatorId: ctx.req.session.userId
      }).save();
      return { entity: post };
    } catch (e) {
      return { errors: handleException(e) };
    }
  }

  @Mutation(() => PostResponse, { nullable: true })
  async updatePost(
    @Arg('input', () => EditPostInput, { nullable: true }) input: EditPostInput
  ): Promise<PostResponse> {
    try {
      const post = await Post.findOne(input.id);
      if (!post) return { errors: [{ message: 'post does not exist' }] };
      Object.assign(post, input);
      await Post.update(post.id, post);
      return { entity: post };
    } catch (e) {
      return { errors: handleException(e) };
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    await Post.delete({ id, creatorId: ctx.req.session.userId });
    return true;
  }
}

export default PostResolver;
