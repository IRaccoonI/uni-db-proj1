// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IJWTState, jwtWithSetUserModel } from '../../../middlewares/jwt';

import { ICommentsChildsPostReq, joiValidateCommentsChildsPost } from '../../../middlewares/joi-comments';
import Posts from '../../../db/models/Posts.model';
import Comments from '../../../db/models/Comments.model';

export default function registerRoute(router: Router) {
  interface CommentsPostCtx extends Context {
    state: IJWTState;
    request: ICommentsChildsPostReq;
  }
  router.post('/', joiValidateCommentsChildsPost, jwtWithSetUserModel, async (ctx: CommentsPostCtx) => {
    const commentId: number = parseInt(ctx.params.id);
    if (commentId == null || isNaN(commentId)) {
      ctx.throw(400, 'Id must be number');
    }

    if ((await Comments.findByPk(commentId)) == null) {
      ctx.throw(404, 'Comment not Found');
    }

    const postId = (await Comments.findOne({ where: { id: commentId } })).postId;

    const newComment = await Comments.create({
      postId: postId,
      ownerId: ctx.state.userModel.id,
      content: ctx.request.body.content,
      parentCommentId: commentId,
    });

    ctx.status = 201;
    ctx.type = 'json';
    ctx.body = { commentId: newComment.id };
  });

  interface CommentsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', jwtWithSetUserModel, async (ctx: CommentsGetCtx) => {
    const commentId: number = parseInt(ctx.params.id);
    if (commentId == null || isNaN(commentId)) {
      ctx.throw(400, 'Id must be number');
    }

    if ((await Comments.findByPk(commentId)) == null) {
      ctx.throw(404, 'Comment not Found');
    }

    const curComments = await Comments.findAll({
      where: {
        parentCommentId: commentId,
      },
    });

    const resComments = curComments.map((c) => c.toJSON());

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = resComments;
  });
}
