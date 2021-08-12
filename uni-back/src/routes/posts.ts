// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IPostsPostReq, joiValidatePostsGet, joiValidatePostsPost, PostsGetQueryType } from '../middlewares/joi-posts';
import { IJWTState, jwtWithSetUserModel } from '../middlewares/jwt';

import Posts from '../db/models/Posts.model';
import Users from '../db/models/Users.model';

export default function registerRoute(router: Router) {
  interface PostsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', joiValidatePostsGet, jwtWithSetUserModel, async (ctx: PostsGetCtx) => {
    const validated = (ctx.request.query as PostsGetQueryType).validated === 'true';

    if (validated && ctx.state.userModel.roleName != 'admin') {
      ctx.throw(403, 'You cannot manage new posts');
    }

    const posts = await Posts.scope('lightList').findAll({
      where: {
        validated: validated,
      },
      order: ['updatedAt'],
    });

    let res: { id: number }[] = [];

    posts.forEach((post) => {
      let curJson: any = post.toJSON();
      delete curJson.likes;
      res.push(curJson);
    });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = res;
  });

  interface PostsPostCtx extends Context {
    state: IJWTState;
    request: IPostsPostReq;
  }
  router.post('/', joiValidatePostsPost, jwtWithSetUserModel, async (ctx: PostsPostCtx) => {
    if (ctx.request.body.withoutVerification && ctx.state.userModel.roleName != 'admin') {
      ctx.throw(403, 'You cannot create a post without verification');
    }

    const newPost = await Posts.scope('defaultScope').create({
      title: ctx.request.body.title,
      content: ctx.request.body.content,
      validated: ctx.request.body.withoutVerification || false,
      ownerId: ctx.state.userModel.id,
    });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = {
      id: newPost.id,
    };
  });
}
