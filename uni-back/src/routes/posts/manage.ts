// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { joiValidatePostsGet, PostsGetQueryType } from '../../middlewares/joi-posts';
import { IJWTState, jwtWithSetUserModel } from '../../middlewares/jwt';

import Posts from '../../db/models/Posts.model';

const TFN = (str: 'true' | 'false' | 'null'): boolean | null => (str == 'true' ? true : str == 'false' ? false : null);

export default function registerRoute(router: Router) {
  interface PostsManageGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', joiValidatePostsGet, jwtWithSetUserModel, async (ctx: PostsManageGetCtx) => {
    const verificationResult = (ctx.request.query as PostsGetQueryType).verificationResult;

    if (ctx.state.userModel.roleName != 'admin') {
      ctx.throw(403, 'You cannot manage new posts');
    }

    let posts = await Posts.scope('manage').findAll({
      where: {},
      order: ['updatedAt'],
    });

    let res: { id: number }[] = [];

    posts.forEach((post) => {
      if (
        (post.lastVerification != null || verificationResult != 'null') &&
        (post.lastVerification == null || post.lastVerification.result != TFN(verificationResult))
      )
        return;
      let curJson: any = post.toJSON();
      delete curJson.likes;
      delete curJson.verification;

      res.push(curJson);
    });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = res;
  });
}
