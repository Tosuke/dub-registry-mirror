import * as Koa from "koa";
import * as Router from "koa-router";
import { buildRouter } from "./routes"

const app = new Koa();
const router = buildRouter();

const removeExt = async (ctx: Koa.Context, next) => {
  const ext = (() => {
    const matched = ctx.path.match(/\.(\w+?)$/);
    return matched !== null ? matched[1] : "";
  })();

  if (ext === "" || ext === "json" ) {
    ctx.path = ctx.path.replace(/\.(\w+?)$/, "");
    await next();
  } else if(ext === "zip") {
    //TODO: add zip handler
  } else {
    ctx.status = 404;
    ctx.body = "Not found";
  }
};

app
  .use(removeExt)
  .use(router.routes())
  .use(router.allowedMethods({
    throw: true
  }))
  .use((ctx) => {
    ctx.status = 404;
    ctx.body = {
      message: "not-found"
    }
  })

app.listen(3000);