import * as koa from "koa";
import * as request from "request-promise-native";

export default async function stats(ctx: koa.Context) {
  const name = ctx.params["name"];
  const version = ctx.params["version"];

  try {
    ctx.body = JSON.parse(await request(`http://code.dlang.org/api/packages/${name}/${version}/stats`));
  } catch (err) {
    ctx.status = 404;
    ctx.body = {
      message: "package/version is not found"
    };
  }
}