// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';
import Alerts from '../../db/models/Alerts.model';
import Comments from '../../db/models/Comments.model';
import Posts from '../../db/models/Posts.model';

import { IJWTState, jwtWithSetUserModel } from '../../middlewares/jwt';

export default function registerRoute(router: Router) {
  interface PostsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', jwtWithSetUserModel, async (ctx: PostsGetCtx) => {
    const alertsCount = await Alerts.count({
      where: {
        userId: ctx.state.userModel.id,
        viewed: false,
      },
    });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = {
      count: alertsCount,
    };
  });
}
