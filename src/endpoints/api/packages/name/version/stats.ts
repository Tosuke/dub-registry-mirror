import * as Koa from "koa";

module.exports = (ctx: Koa.Context) => {
  ctx.body = {
    "downloads": {
      "monthly": 37,
      "total": 37,
      "weekly": 37,
      "daily": 37
    }
  };
}