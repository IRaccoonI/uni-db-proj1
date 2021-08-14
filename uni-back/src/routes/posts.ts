// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import {
  IPostPatchVerificataionReq,
  IPostPostLikeReq,
  IPostsPostReq,
  joiValidatePostPatchVerificataion,
  joiValidatePostPostLike,
  joiValidatePostsGet,
  joiValidatePostsPost,
  PostsGetQueryType,
} from '../middlewares/joi-posts';
import { IJWTState, jwtWithSetUserModel } from '../middlewares/jwt';

import Posts from '../db/models/Posts.model';
import Users from '../db/models/Users.model';
import PostsVerifications from '../db/models/PostsVerifications.model';
import PostsLikes from '../db/models/PostsLikes.model';

const TFN = (str: 'true' | 'false' | 'null'): boolean | null => (str == 'true' ? true : str == 'false' ? false : null);

export default function registerRoute(router: Router) {
  interface PostsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', joiValidatePostsGet, jwtWithSetUserModel, async (ctx: PostsGetCtx) => {
    const verificationResult = (ctx.request.query as PostsGetQueryType).verificationResult;

    if (verificationResult && ctx.state.userModel.roleName != 'admin') {
      ctx.throw(403, 'You cannot manage new posts');
    }

    let posts = await Posts.scope('manageList').findAll({
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

  interface PostsPatchValideteCtx extends Context {
    request: IPostPatchVerificataionReq;
    state: IJWTState;
  }
  router.patch(
    '/:id/verification',
    joiValidatePostPatchVerificataion,
    jwtWithSetUserModel,
    async (ctx: PostsPatchValideteCtx) => {
      const postId: number = parseInt(ctx.params.id);
      if (postId == null) {
        ctx.throw(400, 'Id must be number');
      }

      if (ctx.state.userModel.roleName != 'admin') {
        ctx.throw(403, 'Forbidden for non admin');
      }

      await PostsVerifications.create({
        postId: postId,
        result: ctx.request.body.result,
        reason: ctx.request.body.reason,
      });

      ctx.status = 200;
      ctx.type = 'json';
    },
  );

  interface PostPostLikeCtx extends Context {
    state: IJWTState;
    request: IPostPostLikeReq;
  }
  router.post('/:id/like', joiValidatePostPostLike, jwtWithSetUserModel, async (ctx: PostPostLikeCtx) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null) {
      ctx.throw(400, 'Id must be number');
    }

    const prevLike = await PostsLikes.findOne({
      where: {
        userId: ctx.state.userModel.id,
        postId: postId,
      },
    });

    if (prevLike == null) {
      await PostsLikes.create({
        userId: ctx.state.userModel.id,
        postId: postId,
        value: ctx.request.body.value,
      });
    } else if (prevLike.value === ctx.request.body.value) {
      await PostsLikes.destroy({
        where: {},
        truncate: true,
      });
    } else {
      await PostsLikes.update(
        {
          value: ctx.request.body.value,
        },
        {
          where: {},
        },
      );
    }

    ctx.status = 200;
    ctx.type = 'json';
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
      ownerId: ctx.state.userModel.id,
    });

    //add verificationResult

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = {
      id: newPost.id,
    };
  });
}
