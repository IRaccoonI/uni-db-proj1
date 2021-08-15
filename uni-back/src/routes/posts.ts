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
  interface PostsManageGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/manage', joiValidatePostsGet, jwtWithSetUserModel, async (ctx: PostsManageGetCtx) => {
    const verificationResult = (ctx.request.query as PostsGetQueryType).verificationResult;

    if (ctx.state.userModel.roleName != 'admin') {
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

  interface PostsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', joiValidatePostsGet, jwtWithSetUserModel, async (ctx: PostsGetCtx) => {
    const verificationResult = (ctx.request.query as PostsGetQueryType).verificationResult;

    if ((verificationResult == 'false' || verificationResult == 'null') && ctx.state.userModel.roleName != 'admin') {
      ctx.throw(403, 'You cannot manage new posts');
    }

    let posts = await Posts.scope('viewList').findAll({
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
      delete curJson.lastVerification;

      curJson['likesSum'] = post.likes.reduce((p, c) => p + c.value, 0);
      let selfLike = post.likes.filter((like) => like.userId == ctx.state.userModel.id);
      curJson['selfLikeValue'] = selfLike.length == 0 ? 0 : selfLike[0].value;

      curJson['commentsCount'] = 228;

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

    const newPost = await Posts.create({
      title: ctx.request.body.title,
      content: ctx.request.body.content,
      ownerId: ctx.state.userModel.id,
    });

    if (ctx.request.body.withoutVerification) {
      await PostsVerifications.create({
        postId: newPost.id,
        result: true,
        reason: 'Without verification',
      });
    }

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = {
      id: newPost.id,
    };
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

    if ((await Posts.findOne({ where: { id: postId } })) == null) {
      ctx.throw(404, 'Post not Found');
    }

    const prevLike = await PostsLikes.findOne({
      where: {
        userId: ctx.state.userModel.id,
        postId: postId,
      },
    });

    let currentSelfLikeValue;

    if (prevLike == null) {
      await PostsLikes.create({
        userId: ctx.state.userModel.id,
        postId: postId,
        value: ctx.request.body.value,
      });
      currentSelfLikeValue = ctx.request.body.value;
    } else if (prevLike.value === ctx.request.body.value) {
      await PostsLikes.destroy({
        where: { postId: postId, userId: ctx.state.userModel.id },
      });
      currentSelfLikeValue = 0;
    } else {
      await PostsLikes.update(
        {
          value: ctx.request.body.value,
        },
        {
          where: { postId: postId, userId: ctx.state.userModel.id },
        },
      );
      currentSelfLikeValue = ctx.request.body.value;
    }

    const currentSumLikes = await PostsLikes.sum('value', {
      where: {
        postId: postId,
      },
    });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = {
      currentSumLikes: isNaN(currentSumLikes) ? 0 : currentSumLikes,
      currentSelfLikeValue: currentSelfLikeValue,
    };
  });

  router.post('/:id/incrementView', jwtWithSetUserModel, async (ctx: PostPostLikeCtx) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null) {
      ctx.throw(400, 'Id must be number');
    }

    const curPost = await Posts.findOne({
      where: {
        id: postId,
      },
    });

    if (curPost == null) {
      ctx.throw(404, 'Post not Found');
    }

    await curPost.increment('viewsCount', { silent: true });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = {
      currentViewsCount: curPost.viewsCount,
    };
  });
}
