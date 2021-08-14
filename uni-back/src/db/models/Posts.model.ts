// тут мега кривой и костыльный момент с последней валидацией

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
import PostsVerifications from './PostsVerifications.model';
import { Sequelize } from 'sequelize';

@DefaultScope(() => ({
  attributes: ['id', 'title', 'content', 'updatedAt'],
}))
@Scopes(() => ({
  manageList(verification) {
    return {
      attributes: [
        'id',
        'title',
        'content',
        'updatedAt',
        [
          Sequelize.fn('COALESCE', Sequelize.cast(Sequelize.fn('SUM', Sequelize.col('likes.value')), 'int'), 0),
          'likesCount',
        ],
        'lastVerification',
      ],
      include: [
        {
          model: PostsVerifications,
          attributes: ['id', 'result', 'reason'],
          order: [['id', 'DESC']],
        },
        {
          model: Users,
          attributes: ['id', 'login'],
        },
        {
          model: PostsLikes,
          attributes: [],
        },
      ],
      group: ['Posts.id', 'owner.id', 'verification.id'],
    };
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

  @HasMany(() => PostsVerifications)
  verification: PostsVerifications[];

  @HasMany(() => PostsLikes)
  likes: PostsLikes[];

  @Column(DataType.VIRTUAL)
  get likesValue(): number {
    return !this.likes ? 0 : this.likes.reduce((p, c) => p + c.value, 0);
  }

  @Column(DataType.VIRTUAL)
  get lastVerification(): PostsVerifications {
    return this.verification.length == 0
      ? null
      : this.verification.length == 1
      ? this.verification[0]
      : this.verification.reduce((p, c) => (c.id > p.id ? c : p));
  }

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
