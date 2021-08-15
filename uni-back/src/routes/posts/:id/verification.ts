// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IPostPatchVerificataionReq, joiValidatePostPatchVerificataion } from '../../../middlewares/joi-posts';
import { IJWTState, jwtWithSetUserModel } from '../../../middlewares/jwt';

import Posts from '../../../db/models/Posts.model';
import PostsVerifications from '../../../db/models/PostsVerifications.model';

export default function registerRoute(router: Router) {
  interface PostsPatchValideteCtx extends Context {
    request: IPostPatchVerificataionReq;
    state: IJWTState;
  }
  router.patch('/', joiValidatePostPatchVerificataion, jwtWithSetUserModel, async (ctx: PostsPatchValideteCtx) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null) {
      ctx.throw(400, 'Id must be number');
    }

    if (ctx.state.userModel.roleName != 'admin') {
      ctx.throw(403, 'Forbidden for non admin');
    }

    if ((await Posts.findOne({ where: { id: postId } })) == null) {
      ctx.throw(404, 'Post not Found');
    }

    await PostsVerifications.create({
      postId: postId,
      result: ctx.request.body.result,
      reason: ctx.request.body.reason,
    });

    ctx.status = 200;
    ctx.type = 'json';
  });
}
