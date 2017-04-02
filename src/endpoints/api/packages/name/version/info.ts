import * as koa from "koa";
import versions from "../../../../../models/versions";

export default async function info(ctx: koa.Context) {
  const name = ctx.params["name"];
  const vername = ctx.params["version"];

  const ver = await versions.getByName(name, vername);
  if(ver === null) {
    ctx.status = 404;
    ctx.body = {
      message: "package/version is not found"
    };
    return;
  }

  ctx.body = ver;
}