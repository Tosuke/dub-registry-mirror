import * as koa from "koa";
import packages from "../../models/packages";

export default async function index(ctx: koa.Context) {
  ctx.body = await packages.nameList();
}