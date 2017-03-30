import * as koa from "koa";
import packages from "../../../../models/packages";

export default async function info(ctx: koa.Context) {
  const name = ctx.params["name"];
  const pkg = await packages.getBy(name);
  
  if(pkg !== null) {
    ctx.body = pkg;
  } else {
    ctx.status = 404;
    ctx.body = {
      message: "package is not found"
    };
  }
}