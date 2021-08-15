import * as Joi from '@hapi/joi';
import 'joi-extract-type';
import { Context, Request } from 'koa';
const validateMiddleware = require('koa-joi-validate-middleware');

const comment = {
  id: Joi.number().min(1),
  postId: Joi.number().min(1),
  content: Joi.string().min(3),
  query: {
    verificationResult: Joi.string().valid('true', 'false', 'null'),
  },
};
// call on validation error
function errorCallback(ctx: Context, error: Joi.ValidationError) {
  ctx.throw(400, error.message);
}

const commentsPost = {
  body: Joi.object({
    content: comment.content.required(),
    parentCommentId: comment.id.allow(null).required(),
  }).required(),
};

export const joiValidateCommentsPost = validateMiddleware.create(commentsPost, errorCallback);
type CommentsPostType = Joi.extractType<typeof commentsPost>;
export interface ICommentsPostReq extends Request {
  body?: CommentsPostType['body'];
}

const commentsChildsPost = {
  body: Joi.object({
    content: comment.content.required(),
  }).required(),
};

export const joiValidateCommentsChildsPost = validateMiddleware.create(commentsChildsPost, errorCallback);
type CommentsChildsPostType = Joi.extractType<typeof commentsChildsPost>;
export interface ICommentsChildsPostReq extends Request {
  body?: CommentsChildsPostType['body'];
}
