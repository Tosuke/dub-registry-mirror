import * as koa from "koa";
import packages from "../../../../models/packages";

export default async function latest(ctx: koa.Context) {
  const name = ctx.params["name"];

  const pkg = await packages.getByName(name);
  if(pkg === null) {
    ctx.status = 404;
    ctx.body = {
      message: "package is not found"
    };
    return;
  }

  const latestVersion = await packages.getLatestVersion(pkg)
  if(latestVersion === null) {
    ctx.status = 404;
    ctx.body = {
      message: "version is not found"
    };
    return;
  }

  ctx.response.set({
    "Content-Type": "application/json; charset=utf-8"
  });
  ctx.body = `"${latestVersion.version}"`;
}