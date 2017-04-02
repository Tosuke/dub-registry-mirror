import * as koa from "koa";
import versions from "../models/versions";
import packages from "../models/packages";

export default async function test(ctx: koa.Context) {
  const list = await packages.search();
  ctx.body = list;
}