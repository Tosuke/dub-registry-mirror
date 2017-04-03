import * as koa from "koa";
import versions from "../../../models/versions";

export default async function version(ctx: koa.Context) {
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

  ctx.body = await versions.toPackageVersion(ver);
}