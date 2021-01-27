import bcrypt from 'bcrypt';
import { MyContext } from 'src/interfaces/MyContext';
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
import { User } from '../entities/user.entity';
import handleException from '../utils/handleException';
import { sendEmail } from '../utils/sendEmail';
import { EntityResponse } from './responses/generic.response';

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
class UserResponse extends EntityResponse(User, 'user') {}
@Resolver()
class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string, @Ctx() ctx: MyContext) {
    try {
      const user = await User.findOne({ where: { email } });
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

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
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
      const userIdNum = parseInt(userId);
      const user = await User.findOne(userIdNum);
      if (!user) {
        await ctx.redis.del(FORGET_PASSWORD_PREFIX + token);
        return { errors: [{ message: 'user does not exist anymore' }] };
      }
      //TODO: Need to find a better way to do below stupid thing
      if (password.length < 3)
        return {
          errors: [
            {
              field: 'password',
              message: ' password length should atleast be 3'
            }
          ]
        };
      user.password = await bcrypt.hash(password, 10);
      await User.update(user.id, user);
      // clear out the token after a successful password change
      await ctx.redis.del(FORGET_PASSWORD_PREFIX + token);
      return {};
    } catch (e) {
      console.error(`an error occured in changePassword(...) resolver: ${e}`);
      return { errors: handleException(e) };
    }
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: MyContext) {
    if (!ctx.req.session.userId) return null;
    return User.findOne(ctx.req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await User.create(options).save();
      ctx.req.session.userId = user.id;
      return { entity: user };
    } catch (e) {
      console.error(`an error occured in the regiser(...) resolver: ${e}`);
      return { errors: handleException(e) };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: options.usernameOrEmail.includes('@')
        ? { email: options.usernameOrEmail }
        : { username: options.usernameOrEmail }
    });
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
      entity: user
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
}

export default UserResolver;
