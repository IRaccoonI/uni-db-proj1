// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IJWTState, jwtWithSetUserModel } from '../../../middlewares/jwt';

import { ICommentsPostReq, joiValidateCommentsPost } from '../../../middlewares/joi-comments';
import Posts from '../../../db/models/Posts.model';
import Comments from '../../../db/models/Comments.model';

export default function registerRoute(router: Router) {
  interface CommentsPostCtx extends Context {
    state: IJWTState;
    request: ICommentsPostReq;
  }
  router.post('/', joiValidateCommentsPost, jwtWithSetUserModel, async (ctx: CommentsPostCtx) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null || isNaN(postId)) {
      ctx.throw(400, 'Id must be number');
    }

    if ((await Posts.findByPk(postId)) == null) {
      ctx.throw(404, 'Post not Found');
    }
    const newComment = await Comments.create({
      postId: postId,
      ownerId: ctx.state.userModel.id,
      content: ctx.request.body.content,
      parentCommentId: ctx.request.body.parentCommentId,
    });

    ctx.status = 201;
    ctx.type = 'json';
    ctx.body = { commentId: newComment.id };
  });

  interface CommentsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', jwtWithSetUserModel, async (ctx: CommentsGetCtx) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null || isNaN(postId)) {
      ctx.throw(400, 'Id must be number');
    }

    if ((await Posts.findByPk(postId)) == null) {
      ctx.throw(404, 'Post not Found');
    }

    const curComments = await Comments.findAll({
      where: {
        postId: postId,
        parentCommentId: null,
      },
    });

    const resComments = curComments.map((c) => c.toJSON());

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = resComments;
  });
}
