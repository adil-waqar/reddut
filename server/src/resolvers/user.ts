import { UniqueConstraintViolationException } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import { MyContext } from 'src/types';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql';
import { v4 } from 'uuid';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import EntityValidationError from '../entities/errors/EntityValidationError';
import { User } from '../entities/User';
import getFieldFromError from '../utils/getFieldFromError';
import { sendEmail } from '../utils/sendEmail';

@InputType()
class LoginInput {
  @Field()
  usernameOrEmail: string;
  @Field()
  password: string;
}

@InputType()
class RegisterInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
export class Error {
  @Field({ nullable: true })
  field?: string;
  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];
  @Field({ nullable: true })
  user?: User;
}

@ObjectType()
class ChangePasswordResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];
}

@Resolver()
class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string, @Ctx() ctx: MyContext) {
    try {
      const user = await ctx.em.findOne(User, { email });
      if (!user) return true;
      const token = v4();
      await sendEmail(
        email,
        `Click <a href=http://localhost:3000/change-password/${token}>here</a> to change password.`
      );
      await ctx.redis.set(
        FORGET_PASSWORD_PREFIX + token,
        user.id,
        'ex',
        1000 * 60 * 60
      );
      return true;
    } catch (e) {
      console.error(`an error occurred in forgotPassword(...) resolver: ${e}`);
      return false;
    }
  }

  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<ChangePasswordResponse> {
    try {
      const userId = await ctx.redis.get(FORGET_PASSWORD_PREFIX + token);
      if (!userId)
        return {
          errors: [
            {
              message:
                'Your link has expired, please request again for password change'
            }
          ]
        };
      const user = await ctx.em.findOne(User, { id: Number(userId) });
      if (!user) {
        ctx.redis.del(FORGET_PASSWORD_PREFIX + token);
        return { errors: [{ message: 'user does not exist anymore' }] };
      }
      user.password = password;
      await ctx.em.persistAndFlush(user);
      // clear out the token after a successful password change
      await ctx.redis.del(FORGET_PASSWORD_PREFIX + token);
      return {};
    } catch (e) {
      console.error(`an error occured in changePassword(...) resolver: ${e}`);
      return this.handleException(e);
    }
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.req.session.userId) return null;
    return await ctx.em.findOne(User, { id: ctx.req.session.userId });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    try {
      const user = ctx.em.create(User, {
        username: options.username,
        email: options.email,
        password: options.password
      });
      await ctx.em.persistAndFlush(user);
      ctx.req.session.userId = user.id;
      return { user };
    } catch (e) {
      console.error(`an error occured in the regiser(...) resolver: ${e}`);
      return this.handleException(e);
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(
      User,
      options.usernameOrEmail.includes('@')
        ? { email: options.usernameOrEmail }
        : { username: options.usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'username or email is incorrect'
          }
        ]
      };
    }
    const isValidPass = await bcrypt.compare(options.password, user.password);
    if (!isValidPass)
      return {
        errors: [
          {
            field: 'password',
            message: 'password is incorrect'
          }
        ]
      };

    ctx.req.session.userId = user.id;
    return {
      user
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // This only clears it in redis
      ctx.req.session.destroy((err) => {
        // Clear the browser cookie too
        ctx.res.clearCookie(COOKIE_NAME);
        if (err) {
          console.error(err);
          reject(false);
        } else resolve(true);
      });
    });
  }

  handleException(e: any): UserResponse {
    if (e instanceof UniqueConstraintViolationException) {
      const field = getFieldFromError(e);
      return {
        errors: [
          {
            field,
            message: `${field} already exists`
          }
        ]
      };
    } else if (e instanceof EntityValidationError) {
      return { errors: (e as EntityValidationError).getFieldErrors() };
    } else {
      return {
        errors: [
          {
            message: 'Internal server error'
          }
        ]
      };
    }
  }
}

export default UserResolver;
