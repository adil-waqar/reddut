import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: 'int' })
  value: number;

  @Column()
  @PrimaryColumn()
  userId!: number;

  @Column()
  @PrimaryColumn()
  postId!: number;

  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: 'CASCADE'
  })
  post!: Post;

  @ManyToOne(() => User, (user) => user.updoots)
  user: User;
}
