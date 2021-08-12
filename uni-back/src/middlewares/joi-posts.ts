import * as Joi from '@hapi/joi';
import { any } from 'joi';
import 'joi-extract-type';
import { Context, Request } from 'koa';
const validateMiddleware = require('koa-joi-validate-middleware');

const post = {
  id: Joi.number().min(1),
  title: Joi.string().min(5).max(50),
  content: Joi.string().min(3),
  validated: Joi.string().valid('true', 'false'),
  withoutVerification: Joi.boolean().default(false),
};
// call on validation error
function errorCallback(ctx: Context, error: Joi.ValidationError) {
  ctx.throw(400, error.message);
}

const postsPost = {
  body: Joi.object({
    title: post.title.required(),
    content: post.content.required(),
    withoutVerification: post.withoutVerification,
  }).required(),
};

export const joiValidatePostsPost = validateMiddleware.create(postsPost, errorCallback);
type PostsPostType = Joi.extractType<typeof postsPost>;
export interface IPostsPostReq extends Request {
  body?: PostsPostType['body'];
}

const postsGet = {
  query: {
    validated: post.validated.required(),
  },
};

export const joiValidatePostsGet = validateMiddleware.create(postsGet, errorCallback);
export type PostsGetQueryType = Joi.extractType<typeof postsGet['query']>;
