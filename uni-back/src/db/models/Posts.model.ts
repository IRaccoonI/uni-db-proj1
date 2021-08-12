import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  DefaultScope,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Scopes,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import Users from './Users.model';
import PostsLikes from './PostsLikes.model';

@DefaultScope(() => ({
  attributes: ['id', 'title', 'content', 'updatedAt'],
}))
@Scopes(() => ({
  lightList: {
    attributes: ['id', 'title', 'content', 'updatedAt', 'likesCount'],
    include: [
      {
        model: Users,
        attributes: ['id', 'login'],
      },
      {
        model: PostsLikes,
        attributes: ['value'],
      },
    ],
  },
}))
@Table
export default class Posts extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  content: string;

  @ForeignKey(() => Users)
  @Column(DataType.INTEGER)
  ownerId: number;

  @BelongsTo(() => Users)
  owner: Users;

  @Column(DataType.BOOLEAN)
  validated: boolean;

  @HasMany(() => PostsLikes)
  likes: PostsLikes[];

  @Column(DataType.VIRTUAL)
  get likesCount(): number {
    return !this.likes ? 0 : this.likes.reduce((p, c) => p + c.value, 0);
  }

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
